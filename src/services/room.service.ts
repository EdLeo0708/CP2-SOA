import { RoomRepository } from "../repositories/room.repository";
import { RoomDTO } from "../dtos/schemas";

export class RoomService {
  private roomRepository = new RoomRepository();

  async getAllRooms() {
    return await this.roomRepository.findAll();
  }

  async getRoomById(id: string) {
    const room = await this.roomRepository.findById(id);
    if (!room) throw new Error("Room not found");
    return room;
  }

  async createRoom(data: RoomDTO) {
    const existing = await this.roomRepository.findByNumber(data.number);
    if (existing) throw new Error("Room number already exists");
    return await this.roomRepository.create(data);
  }

  async updateRoom(id: string, data: Partial<RoomDTO>) {
    await this.getRoomById(id);
    return await this.roomRepository.update(id, data);
  }

  async deleteRoom(id: string) {
    const room = await this.getRoomById(id);
    // Rule: não excluir fisicamente quartos com reservas; usar INATIVO ou bloqueio.
    // We should check if there are reservations.
    // For now, let's just implement the "Soft Delete" logic as requested.
    return await this.roomRepository.update(id, { status: "INATIVO" });
  }
}
