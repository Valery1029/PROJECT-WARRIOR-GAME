CREATE DATABASE IF NOT EXISTS game_warriors;
USE game_warriors;

CREATE TABLE powers (
  Power_id int(11) NOT NULL,
  Power_name varchar(50) NOT NULL,
  Power_description varchar(50) NOT NULL,
  Power_percentage int(11) DEFAULT NULL
)