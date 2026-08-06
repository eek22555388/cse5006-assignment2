-- AlterTable
ALTER TABLE "RequestLog" ADD COLUMN     "clientIp" TEXT,
ADD COLUMN     "feedId" TEXT,
ADD COLUMN     "statusCode" INTEGER,
ADD COLUMN     "userAgent" TEXT;

-- CreateIndex
CREATE INDEX "RequestLog_clientIp_idx" ON "RequestLog"("clientIp");

-- CreateIndex
CREATE INDEX "RequestLog_feedId_idx" ON "RequestLog"("feedId");
