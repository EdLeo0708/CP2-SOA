import prisma from "./prisma";
import { GuestDTO } from "../dtos/schemas";

export class GuestRepository {
  async findAll() {
    return await prisma.guest.findMany();
  }

  async findById(id: string) {
    return await prisma.guest.findUnique({ where: { id } });
  }

  async findByDocument(document: string) {
    return await prisma.guest.findUnique({ where: { document } });
  }

  async create(data: GuestDTO) {
    return await prisma.guest.create({ data });
  }

  async update(id: string, data: Partial<GuestDTO>) {
    return await prisma.guest.update({ where: { id }, data });
  }

  async delete(id: string) {
    return await prisma.guest.delete({ where: { id } });
  }
}
