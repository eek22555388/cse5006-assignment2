-- DropForeignKey
ALTER TABLE "FeedItem" DROP CONSTRAINT "FeedItem_authorId_fkey";

-- DropIndex
DROP INDEX "FeedItem_feedId_publishedAt_idx";

-- AlterTable
ALTER TABLE "Author" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "FeedItem" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE INDEX "FeedItem_feedId_isActive_publishedAt_idx" ON "FeedItem"("feedId", "isActive", "publishedAt");

-- AddForeignKey
ALTER TABLE "FeedItem" ADD CONSTRAINT "FeedItem_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Author"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
