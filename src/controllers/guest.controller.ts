import { Request, Response, NextFunction } from "express";
import { GuestService } from "../services/guest.service";
import { GuestSchema } from "../dtos/schemas";

const guestService = new GuestService();

export class GuestController {
  async getAll(req: Request, res: Response) {
    const guests = await guestService.getAllGuests();
    res.json(guests);
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const guest = await guestService.getGuestById(req.params.id as string);
      res.json(guest);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = GuestSchema.parse(req.body);
      const guest = await guestService.createGuest(data);
      res.status(201).json(guest);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const guest = await guestService.updateGuest(req.params.id as string, req.body);
      res.json(guest);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await guestService.deleteGuest(req.params.id as string);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
