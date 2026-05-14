import { GuestRepository } from "../repositories/guest.repository";
import { GuestDTO } from "../dtos/schemas";

export class GuestService {
  private guestRepository = new GuestRepository();

  async getAllGuests() {
    return await this.guestRepository.findAll();
  }

  async getGuestById(id: string) {
    const guest = await this.guestRepository.findById(id);
    if (!guest) throw new Error("Guest not found");
    return guest;
  }

  async createGuest(data: GuestDTO) {
    const existing = await this.guestRepository.findByDocument(data.document);
    if (existing) throw new Error("Document already registered");
    return await this.guestRepository.create(data);
  }

  async updateGuest(id: string, data: Partial<GuestDTO>) {
    await this.getGuestById(id);
    return await this.guestRepository.update(id, data);
  }

  async deleteGuest(id: string) {
    await this.getGuestById(id);
    // Check for reservations? The PDF says "não excluir fisicamente quartos com reservas". 
    // It doesn't explicitly say for guests, but usually the same applies.
    return await this.guestRepository.delete(id);
  }
}
