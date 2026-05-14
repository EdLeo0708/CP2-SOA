import { Request, Response, NextFunction } from "express";
import { ReservationService } from "../services/reservation.service";
import { ReservationSchema, CheckInSchema, CheckOutSchema } from "../dtos/schemas";

const reservationService = new ReservationService();

export class ReservationController {
  async getAll(req: Request, res: Response) {
    const reservations = await reservationService.getAllReservations();
    res.json(reservations);
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const reservation = await reservationService.getReservationById(req.params.id as string);
      res.json(reservation);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = ReservationSchema.parse(req.body);
      const reservation = await reservationService.createReservation(data);
      res.status(201).json(reservation);
    } catch (error) {
      next(error);
    }
  }

  async checkIn(req: Request, res: Response, next: NextFunction) {
    try {
      const { checkin_at } = CheckInSchema.parse(req.body);
      const reservation = await reservationService.checkIn(req.params.id as string, checkin_at);
      res.json(reservation);
    } catch (error) {
      next(error);
    }
  }

  async checkOut(req: Request, res: Response, next: NextFunction) {
    try {
      const { checkout_at } = CheckOutSchema.parse(req.body);
      const reservation = await reservationService.checkOut(req.params.id as string, checkout_at);
      res.json(reservation);
    } catch (error) {
      next(error);
    }
  }

  async cancel(req: Request, res: Response, next: NextFunction) {
    try {
      const reservation = await reservationService.cancelReservation(req.params.id as string);
      res.json(reservation);
    } catch (error) {
      next(error);
    }
  }
}
