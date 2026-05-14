import { ReservationRepository } from "../repositories/reservation.repository";
import { GuestRepository } from "../repositories/guest.repository";
import { RoomRepository } from "../repositories/room.repository";
import { ReservationDTO } from "../dtos/schemas";

export class ReservationService {
  private reservationRepository = new ReservationRepository();
  private guestRepository = new GuestRepository();
  private roomRepository = new RoomRepository();

  async getAllReservations() {
    return await this.reservationRepository.findAll();
  }

  async getReservationById(id: string) {
    const res = await this.reservationRepository.findById(id);
    if (!res) throw new Error("Reservation not found");
    return res;
  }

  async createReservation(data: ReservationDTO) {
    // 1. Check Guest
    const guest = await this.guestRepository.findById(data.guest_id);
    if (!guest) throw new Error("Guest not found");

    // 2. Check Room
    const room = await this.roomRepository.findById(data.room_id);
    if (!room) throw new Error("Room not found");
    if (room.status !== "ATIVO") throw new Error("Room is not available (INATIVO)");

    // Rule 1: Valid Dates (InvalidDateRangeException)
    if (data.checkout_expected <= data.checkin_expected) {
      throw new Error("InvalidDateRangeException: Checkout date must be after checkin date");
    }

    // Rule 3: Capacity (CapacityExceededException)
    if (data.number_of_guests > room.capacity) {
      throw new Error("CapacityExceededException: Number of guests exceeds room capacity");
    }

    // Rule 2: Overlap Check (RoomUnavailableException)
    const overlaps = await this.reservationRepository.findOverlapping(
      data.room_id,
      data.checkin_expected,
      data.checkout_expected
    );
    if (overlaps.length > 0) throw new Error("RoomUnavailableException: Room is already occupied in this period");

    // Amount calculation
    const days = Math.max(1, Math.ceil((data.checkout_expected.getTime() - data.checkin_expected.getTime()) / (1000 * 60 * 60 * 24)));
    const estimated_amount = Number(room.price_per_night) * days;

    return await this.reservationRepository.create({
      guest_id: data.guest_id,
      room_id: data.room_id,
      number_of_guests: data.number_of_guests,
      checkin_expected: data.checkin_expected,
      checkout_expected: data.checkout_expected,
      estimated_amount,
      status: "CREATED",
    });
  }

  async checkIn(id: string, checkin_at?: Date) {
    const res = await this.getReservationById(id);

    // Rule 4: FSM Transitions (InvalidReservationStateException)
    if (res.status !== "CREATED") throw new Error("InvalidReservationStateException: Invalid reservation status for check-in");

    const now = checkin_at || new Date();
    
    // Rule 5: Check-in Window (422 Unprocessable Entity)
    const expected = new Date(res.checkin_expected);
    if (now.toDateString() !== expected.toDateString()) {
       throw new Error("Check-in window violation: Check-in is only allowed on the expected day");
    }

    return await this.reservationRepository.update(id, {
      status: "CHECKED_IN",
      checkin_at: now,
    });
  }

  async checkOut(id: string, checkout_at?: Date) {
    const res = await this.getReservationById(id);

    // Rule 4: FSM Transitions (InvalidReservationStateException)
    if (res.status !== "CHECKED_IN") throw new Error("InvalidReservationStateException: Invalid reservation status for check-out");

    const now = checkout_at || new Date();
    const checkin = res.checkin_at || res.checkin_expected;

    // Rule 6: Value calculation
    const days = Math.max(1, Math.ceil((now.getTime() - checkin.getTime()) / (1000 * 60 * 60 * 24)));
    const final_amount = Number((res as any).room.price_per_night) * days;

    return await this.reservationRepository.update(id, {
      status: "CHECKED_OUT",
      checkout_at: now,
      final_amount,
    });
  }

  async cancelReservation(id: string) {
    const res = await this.getReservationById(id);

    // Rule 4: FSM Transitions (InvalidReservationStateException)
    if (res.status !== "CREATED") {
      throw new Error("InvalidReservationStateException: Cancellation only allowed for reservations in CREATED status");
    }

    return await this.reservationRepository.update(id, {
      status: "CANCELED",
    });
  }
}
