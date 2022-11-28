-- Active: 1667323247137@@127.0.0.1@3306@bip
SELECT DAYNAME(`createdAt`), COUNT(*)
FROM `FacebookLike` GROUP BY DAYOFWEEK(`createdAt`)
