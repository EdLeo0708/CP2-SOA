import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clean database
  await prisma.reservation.deleteMany();
  await prisma.room.deleteMany();
  await prisma.guest.deleteMany();

  // Seed Guests
  const guest1 = await prisma.guest.create({
    data: {
      id: "11111111-1111-1111-1111-111111111111",
      full_name: "Ana Silva",
      document: "12345678901",
      email: "ana@example.com",
      phone: "+55-11-99999-1111",
    },
  });

  const guest2 = await prisma.guest.create({
    data: {
      id: "22222222-2222-2222-2222-222222222222",
      full_name: "Bruno Souza",
      document: "98765432100",
      email: "bruno@example.com",
      phone: "+55-21-98888-2222",
    },
  });

  // Seed Rooms
  const room1 = await prisma.room.create({
    data: {
      id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      number: 101,
      type: "STANDARD",
      capacity: 2,
      price_per_night: 250.00,
      status: "ATIVO",
    },
  });

  const room2 = await prisma.room.create({
    data: {
      id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
      number: 201,
      type: "DELUXE",
      capacity: 3,
      price_per_night: 380.00,
      status: "ATIVO",
    },
  });

  const room3 = await prisma.room.create({
    data: {
      id: "cccccccc-cccc-cccc-cccc-cccccccccccc",
      number: 301,
      type: "SUITE",
      capacity: 4,
      price_per_night: 520.00,
      status: "ATIVO",
    },
  });

  // Seed Reservation
  await prisma.reservation.create({
    data: {
      id: "99999999-9999-9999-9999-999999999999",
      guest_id: guest1.id,
      room_id: room1.id,
      checkin_expected: new Date("2025-11-05"),
      checkout_expected: new Date("2025-11-07"),
      status: "CREATED",
      estimated_amount: 2 * 250.00,
    },
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
