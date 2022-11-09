-- DropIndex
DROP INDEX `YoutubeContent_source_title_idx` ON `YoutubeContent`;

-- CreateIndex
CREATE FULLTEXT INDEX `YoutubeContent_title_idx` ON `YoutubeContent`(`title`);
