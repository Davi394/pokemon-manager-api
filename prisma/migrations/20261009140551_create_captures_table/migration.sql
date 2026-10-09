-- CreateTable
CREATE TABLE "captures" (
    "id" TEXT NOT NULL,
    "trainer_id" TEXT NOT NULL,
    "pokedex_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "types" TEXT[],
    "sprite" TEXT,
    "hp" INTEGER NOT NULL,
    "attack" INTEGER NOT NULL,
    "defense" INTEGER NOT NULL,
    "special_attack" INTEGER NOT NULL,
    "special_defense" INTEGER NOT NULL,
    "speed" INTEGER NOT NULL,
    "captured_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "captures_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "captures_trainer_id_idx" ON "captures"("trainer_id");

-- AddForeignKey
ALTER TABLE "captures" ADD CONSTRAINT "captures_trainer_id_fkey" FOREIGN KEY ("trainer_id") REFERENCES "trainers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
