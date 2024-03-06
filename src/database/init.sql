-- If Exists Table Drop
DROP TABLE IF EXISTS posts cascade;
DROP TABLE IF EXISTS comments cascade;

CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  group_id INTEGER NOT NULL,
  text VARCHAR(255) NOT NULL,
  created_by INTEGER NOT NULL
);

INSERT INTO posts (group_id, text, created_by) VALUES
  (1, 'Test post 1', 123),
  (2, 'Test post 2', 456),
  (1, 'Test post 3', 789);


CREATE TABLE comments (
  id SERIAL PRIMARY KEY, 
  post_id INTEGER NOT NULL,
  text VARCHAR(255) NOT NULL,
  created_by INTEGER NOT NULL
);

INSERT INTO comments (post_id, text, created_by) VALUES
  (1, 'Test comment 1', 123),
  (1, 'Test comment 2', 456),
  (2, 'Test comment 3', 789);