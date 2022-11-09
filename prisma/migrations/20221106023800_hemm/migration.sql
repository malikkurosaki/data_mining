-- CreateIndex
CREATE FULLTEXT INDEX `GoogleNews_title_des_idx` ON `GoogleNews`(`title`, `des`);

-- CreateIndex
CREATE FULLTEXT INDEX `TwitterLates_content_idx` ON `TwitterLates`(`content`);

-- CreateIndex
CREATE FULLTEXT INDEX `YoutubeContent_source_title_idx` ON `YoutubeContent`(`source`, `title`);
