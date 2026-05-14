import { Router } from "express";
import { GuestController } from "../controllers/guest.controller";
import { RoomController } from "../controllers/room.controller";
import { ReservationController } from "../controllers/reservation.controller";

const router = Router();

const guestController = new GuestController();
const roomController = new RoomController();
const reservationController = new ReservationController();

// Guests
router.get("/guests", guestController.getAll);
router.get("/guests/:id", guestController.getById);
router.post("/guests", guestController.create);
router.put("/guests/:id", guestController.update);
router.delete("/guests/:id", guestController.delete);

// Rooms
router.get("/rooms", roomController.getAll);
router.get("/rooms/:id", roomController.getById);
router.post("/rooms", roomController.create);
router.put("/rooms/:id", roomController.update);
router.delete("/rooms/:id", roomController.delete);

// Reservations
router.get("/reservations", reservationController.getAll);
router.get("/reservations/:id", reservationController.getById);
router.post("/reservations", reservationController.create);
router.post("/reservations/:id/check-in", reservationController.checkIn);
router.post("/reservations/:id/check-out", reservationController.checkOut);
router.post("/reservations/:id/cancel", reservationController.cancel);

export default router;
