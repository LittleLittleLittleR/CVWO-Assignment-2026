CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- USERS
INSERT INTO users (id, username)
VALUES
  (uuid_generate_v4(), 'alice'),
  (uuid_generate_v4(), 'bob'),
  (uuid_generate_v4(), 'charlie');

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
    ('charlie', 'A Seeded Topic', 'This is a topic created during seeding'),
    ('alice', 'Go Backend', 'Discussion about Go backend development'),
    ('bob',   'React Frontend', 'All things React frontend'),
    ('alice', 'Database Design', 'Best practices for database design'),
    ('bob',   'DevOps', 'CI/CD and infrastructure management'),
    ('charlie', 'Machine Learning', 'Exploring ML concepts and applications')
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
FROM (
  VALUES
    ('bob', 'A Seeded Topic', 'Seeded Post', 'This is a seeded post'),
    ('bob', 'Database Design', 'Database Tips', 'Sharing DB tips'),
    ('alice', 'React Frontend', 'React Hooks', 'Hooks discussion'),
    ('charlie', 'Machine Learning', 'ML Basics', 'Intro to ML concepts'),
    ('bob', 'Database Design', 'Database Normalization', '1NF, 2NF, 3NF explained'),
    ('alice', 'React Frontend', 'Hello from the React world', 'Welcome to the React discussion'),
    ('charlie', 'Go Backend', 'Go Router', 'Routing in Go applications'),
    ('bob', 'Machine Learning', 'Linear Regression', 'Understanding linear regression')
) AS p(username, topic_name, title, body)
JOIN users u  ON u.username = p.username
JOIN topics tp ON tp.topic_name = p.topic_name;


-- COMMENTS
INSERT INTO comments (id, user_id, post_id, body)
SELECT
  uuid_generate_v4(),
  u.id,
  p.id,
  c.body
FROM (
  VALUES
    ('alice', 'Seeded Post', 'Great post, Bob!'),
    ('bob', 'Seeded Post', 'Hope you like my post!'),
    ('charlie', 'Hello from the React world', 'Amazing!'),
    ('alice', 'Database Tips', 'These tips are really helpful.'),
    ('charlie', 'Database Normalization', 'I learned a lot from this post.')
) AS c(username, post_title, body)
JOIN users u ON u.username = c.username
JOIN posts p ON p.title = c.post_title;

-- REPLIES
INSERT INTO comments (id, user_id, post_id, parent_comment_id, body)
SELECT
  uuid_generate_v4(),
  u.id,
  p.id,
  parent.id,
  r.body
FROM (
  VALUES
    ('bob', 'Seeded Post', 'Great post, Bob!', 'Thanks, Alice!'),
    ('alice',   'Seeded Post', 'Hope you like my post!', 'We do!')
) AS r(username, post_title, parent_body, body)
JOIN users u ON u.username = r.username
JOIN posts p ON p.title = r.post_title
JOIN comments parent ON parent.body = r.parent_body;