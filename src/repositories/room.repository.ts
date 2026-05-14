import prisma from "./prisma";
import { RoomDTO } from "../dtos/schemas";

export class RoomRepository {
  async findAll() {
    return await prisma.room.findMany();
  }

  async findById(id: string) {
    return await prisma.room.findUnique({ where: { id } });
  }

  async findByNumber(number: number) {
    return await prisma.room.findUnique({ where: { number } });
  }

  async create(data: RoomDTO) {
    return await prisma.room.create({
      data: {
        ...data,
        price_per_night: data.price_per_night,
      },
    });
  }

  async update(id: string, data: Partial<RoomDTO>) {
    return await prisma.room.update({ where: { id }, data });
  }

  async delete(id: string) {
    // Note: The PDF says not to physically delete if there are reservations,
    // but the repository just provides the primitive. Service will handle logic.
    return await prisma.room.delete({ where: { id } });
  }
}
