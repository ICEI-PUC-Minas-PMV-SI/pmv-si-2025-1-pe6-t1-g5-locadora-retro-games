-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "cpf" VARCHAR(11) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "street" VARCHAR(100) NOT NULL,
    "number" INTEGER NOT NULL,
    "neighborhood" VARCHAR(100) NOT NULL,
    "city" VARCHAR(100) NOT NULL,
    "state" VARCHAR(2) NOT NULL,
    "zipCode" VARCHAR(8) NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Console" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "Console_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" SERIAL NOT NULL,
    "consoleId" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "description" TEXT,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reserve" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "gameId" INTEGER NOT NULL,
    "statusReserveId" INTEGER NOT NULL,
    "reserveDate" TIMESTAMP(3),
    "approveDate" TIMESTAMP(3),
    "returnDate" TIMESTAMP(3),

    CONSTRAINT "Reserve_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StatusReserve" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "StatusReserve_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_cpf_key" ON "User"("cpf");

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_consoleId_fkey" FOREIGN KEY ("consoleId") REFERENCES "Console"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reserve" ADD CONSTRAINT "Reserve_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reserve" ADD CONSTRAINT "Reserve_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reserve" ADD CONSTRAINT "Reserve_statusReserveId_fkey" FOREIGN KEY ("statusReserveId") REFERENCES "StatusReserve"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
