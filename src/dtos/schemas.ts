import { z } from "zod";

export const GuestSchema = z.object({
  full_name: z.string().min(3, "Name must be at least 3 characters"),
  document: z.string().min(5, "Document must be at least 5 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
});

export type GuestDTO = z.infer<typeof GuestSchema>;

export const RoomSchema = z.object({
  number: z.number().int().positive(),
  type: z.enum(["STANDARD", "DELUXE", "SUITE"]),
  capacity: z.number().int().positive(),
  price_per_night: z.number().positive(),
  status: z.enum(["ATIVO", "INATIVO"]).default("ATIVO"),
});

export type RoomDTO = z.infer<typeof RoomSchema>;

export const ReservationSchema = z.object({
  guest_id: z.string().uuid("Invalid guest ID"),
  room_id: z.string().uuid("Invalid room ID"),
  number_of_guests: z.number().int().positive().default(1),
  checkin_expected: z.string().transform((str) => new Date(str)),
  checkout_expected: z.string().transform((str) => new Date(str)),
});

export type ReservationDTO = z.infer<typeof ReservationSchema>;

export const CheckInSchema = z.object({
  checkin_at: z.string().transform((str) => new Date(str)).optional(),
});

export const CheckOutSchema = z.object({
  checkout_at: z.string().transform((str) => new Date(str)).optional(),
});
