-- CreateTable
CREATE TABLE "url" (
    "id" SERIAL NOT NULL,
    "long_url" VARCHAR NOT NULL,
    "short_url" VARCHAR NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "url_pkey" PRIMARY KEY ("id")
);
