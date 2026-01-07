-- Users
INSERT INTO users (id, username)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'alice'),
  ('22222222-2222-2222-2222-222222222222', 'bob');

-- Topics
INSERT INTO topics (id, user_id, topic_name, topic_description)
VALUES
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '11111111-1111-1111-1111-111111111111',
    'Go Backend',
    'Discussion about Go backend development'
  );

-- Posts
INSERT INTO posts (id, user_id, topic_id, title, body)
VALUES
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    '22222222-2222-2222-2222-222222222222',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'First Post',
    'This is a seeded post'
  );

-- Comments
INSERT INTO comments (id, user_id, post_id, body)
VALUES
  (
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    '11111111-1111-1111-1111-111111111111',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'Looks good!'
  );
