-- Root copy of backend/seed.sql for convenience
CREATE DATABASE IF NOT EXISTS taskdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE taskdb;

DROP TABLE IF EXISTS tasks;

CREATE TABLE tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NULL,
  due_date DATE NULL,
  priority ENUM('low','medium','high') NOT NULL DEFAULT 'medium',
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT INTO tasks (title, description, due_date, priority, completed)
VALUES
  ('Buy groceries', 'Milk, eggs, bread', DATE_ADD(CURDATE(), INTERVAL 2 DAY), 'medium', FALSE),
  ('Pay utilities', 'Electricity bill', DATE_ADD(CURDATE(), INTERVAL 5 DAY), 'high', FALSE),
  ('Read a book', '30 minutes before bed', NULL, 'low', TRUE);





