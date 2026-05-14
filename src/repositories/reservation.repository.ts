import prisma from "./prisma";
import { Reservation } from "@prisma/client";

export class ReservationRepository {
  async findAll() {
    return await prisma.reservation.findMany({
      include: { guest: true, room: true },
    });
  }

  async findById(id: string) {
    return await prisma.reservation.findUnique({
      where: { id },
      include: { guest: true, room: true },
    });
  }

  async findOverlapping(room_id: string, start: Date, end: Date) {
    // Rule: overlap if (startA < endB) AND (endA > startB)
    return await prisma.reservation.findMany({
      where: {
        room_id,
        status: { not: "CANCELED" },
        AND: [
          { checkin_expected: { lt: end } },
          { checkout_expected: { gt: start } },
        ],
      },
    });
  }

  async findByGuestId(guest_id: string) {
    return await prisma.reservation.findMany({ where: { guest_id } });
  }

  async findByRoomId(room_id: string) {
    return await prisma.reservation.findMany({ where: { room_id } });
  }

  async create(data: any) {
    return await prisma.reservation.create({ data });
  }

  async update(id: string, data: any) {
    return await prisma.reservation.update({ where: { id }, data });
  }
}
