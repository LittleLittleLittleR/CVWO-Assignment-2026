CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- USERS
INSERT INTO users (id, username)
VALUES
  (uuid_generate_v4(), 'alice'),
  (uuid_generate_v4(), 'bob');

-- TOPICS
INSERT INTO topics (id, user_id, topic_name, topic_description)
SELECT
  uuid_generate_v4(),
  u.id,
  t.topic_name,
  t.topic_description
FROM users u
JOIN (
  VALUES
    ('alice', 'Go Backend', 'Discussion about Go backend development'),
    ('bob',   'React Frontend', 'All things React frontend'),
    ('alice', 'Database Design', 'Best practices for database design'),
    ('bob',   'DevOps', 'CI/CD and infrastructure management')
) AS t(username, topic_name, topic_description)
ON u.username = t.username;

-- POSTS
INSERT INTO posts (id, user_id, topic_id, title, body)
SELECT
  uuid_generate_v4(),
  u.id,
  tp.id,
  p.title,
  p.body
FROM users u
JOIN topics tp ON (
  (u.username = 'bob'   AND tp.topic_name = 'Go Backend') OR
  (u.username = 'alice' AND tp.topic_name = 'React Frontend') OR
  (u.username = 'bob'   AND tp.topic_name = 'Database Design') OR
  (u.username = 'alice' AND tp.topic_name = 'React Frontend')
)
JOIN (
  VALUES
    ('bob',   'First Post', 'This is a seeded post'),
    ('alice', 'Hello World', 'Welcome to the React frontend discussion'),
    ('bob',   'Database Tips', 'Sharing some tips on database design'),
    ('alice', 'React Hooks', 'Let us discuss React Hooks and their usage')
) AS p(username, title, body)
ON u.username = p.username;

-- COMMENTS
INSERT INTO comments (id, user_id, post_id, body)
SELECT
  uuid_generate_v4(),
  u.id,
  p.id,
  'Looks good!'
FROM users u
JOIN posts p ON p.title = 'First Post'
WHERE u.username = 'alice';
