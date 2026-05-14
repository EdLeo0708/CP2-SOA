import { Request, Response, NextFunction } from "express";
import { RoomService } from "../services/room.service";
import { RoomSchema } from "../dtos/schemas";

const roomService = new RoomService();

export class RoomController {
  async getAll(req: Request, res: Response) {
    const rooms = await roomService.getAllRooms();
    res.json(rooms);
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const room = await roomService.getRoomById(req.params.id as string);
      res.json(room);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = RoomSchema.parse(req.body);
      const room = await roomService.createRoom(data);
      res.status(201).json(room);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const room = await roomService.updateRoom(req.params.id as string, req.body);
      res.json(room);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await roomService.deleteRoom(req.params.id as string);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
