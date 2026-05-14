-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_reservations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "guest_id" TEXT NOT NULL,
    "room_id" TEXT NOT NULL,
    "checkin_expected" DATETIME NOT NULL,
    "checkout_expected" DATETIME NOT NULL,
    "checkin_at" DATETIME,
    "checkout_at" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'CREATED',
    "number_of_guests" INTEGER NOT NULL DEFAULT 1,
    "estimated_amount" DECIMAL NOT NULL,
    "final_amount" DECIMAL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "reservations_guest_id_fkey" FOREIGN KEY ("guest_id") REFERENCES "guests" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "reservations_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_reservations" ("checkin_at", "checkin_expected", "checkout_at", "checkout_expected", "created_at", "estimated_amount", "final_amount", "guest_id", "id", "room_id", "status", "updated_at") SELECT "checkin_at", "checkin_expected", "checkout_at", "checkout_expected", "created_at", "estimated_amount", "final_amount", "guest_id", "id", "room_id", "status", "updated_at" FROM "reservations";
DROP TABLE "reservations";
ALTER TABLE "new_reservations" RENAME TO "reservations";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
