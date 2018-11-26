-- create user 1  with user 2 as a contact:
INSERT INTO users (name, secrethash) VALUES('michiel', '$2b$10$tmznzb0z6FTgb4RNRd5NYOp1WR2SHYvnZuDzawF6BHZPNygsFZ8me');
INSERT INTO contacts (user_id, name, url, token, min, max) VALUES (1, 'Eddie', 'http://localhost:3000/edward/Micky', '45yga3iuhewp3oi3w4j', -10, 1000);

-- create user 2  with users 1 and 3 as contacts:
INSERT INTO users (name, secrethash) VALUES('edward', '$2b$10$GuyyjgXJqoSYaalD/lFJFug4ikCUhHjcjMaZoQjVC/XLT8FdaDkTG');
INSERT INTO contacts (user_id, name, url, token, min, max) VALUES (2, 'Micky', 'http://localhost:3000/michiel/Eddie', '45yga3iuhewp3oi3w4j', -10, 1000);
INSERT INTO contacts (user_id, name, url, token, min, max) VALUES (2, 'Don', 'http://localhost:3000/donald/Ed', '45yga3iuhewp3oi3w4j', -10, 1000);

-- create user 3  with user 2 as a contact:
INSERT INTO users (name, secrethash) VALUES('donald', '$2b$10$GuyyjgXJqoSYaalD/lFJFug4ikCUhHjcjMaZoQjVC/XLT8FdaDkTG');
INSERT INTO contacts (user_id, name, url, token, min, max) VALUES (3, 'Ed', 'http://localhost:3000/edward/Don', '45yga3iuhewp3oi3w4j', -10, 1000);

-- two copies of transaction from user 1 to user 2
INSERT INTO transactions (user_id, contact_id, requested_at, description, direction, amount) VALUES (1, 1, '12-11-2018', 'Beers after squash game', 'OUT', 25);
INSERT INTO transactions (user_id, contact_id, requested_at, description, direction, amount) VALUES (2, 2, '12-11-2018', 'Beers after squash game', 'IN', 25);

-- preimage
INSERT INTO preimages (user_id, hash, preimage) VALUES (3, 'bc21571c5f1968c083c5740bb0879bde3f61c787e3c41540cd3290604f70bbed', '36d0589ec033779c31b50a8cff4aeeacaece3c0ecfe0d8a300b307fd29cf59a3');
