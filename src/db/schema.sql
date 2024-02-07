CREATE TABLE verification_token
(
  identifier TEXT NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  token TEXT NOT NULL,

  PRIMARY KEY (identifier, token)
);

CREATE TABLE accounts
(
  id SERIAL,
  "userId" INTEGER NOT NULL,
  type VARCHAR(255) NOT NULL,
  provider VARCHAR(255) NOT NULL,
  "providerAccountId" VARCHAR(255) NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at BIGINT,
  id_token TEXT,
  scope TEXT,
  session_state TEXT,
  token_type TEXT,

  PRIMARY KEY (id)
);

CREATE TABLE sessions
(
  id SERIAL,
  "userId" INTEGER NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  "sessionToken" VARCHAR(255) NOT NULL,

  PRIMARY KEY (id)
);

CREATE TABLE users
(
  id SERIAL,
  name VARCHAR(255),
  email VARCHAR(255),
  "emailVerified" TIMESTAMPTZ,
  image TEXT,

  PRIMARY KEY (id)
);

CREATE TABLE favorites
(
  userId INTEGER NOT NULL,
  photoId INTEGER NOT NULL,
  src TEXT NOT NULL,
  rover VARCHAR(15) NOT NULL,
  sol INTEGER NOT NULL,
  camera VARCHAR(25),
  PRIMARY KEY (userId, photoId)
);

INSERT INTO favorites (userId, photoId, src, rover, sol, camera) 
VALUES (
  1, 
  290673, 
  'http://mars.nasa.gov/mer/gallery/all/2/r/001/2R126468012EDN0000P1002L0M1-BR.JPG', 
  'Spirit', 
  1, 
  'RHAZ'
);

INSERT INTO favorites (userId, photoId, src, rover, sol, camera) 
VALUES (
  1, 
  318422, 
  'http://mars.nasa.gov/mer/gallery/all/2/n/001/2N126468305EDN0000P1502L0M1-BR.JPG', 
  'Spirit', 
  1, 
  'NAVCAM'
);

INSERT INTO favorites (userId, photoId, src, rover, sol, camera) 
VALUES (
  2, 
  318422, 
  'http://mars.nasa.gov/mer/gallery/all/2/n/001/2N126468305EDN0000P1502L0M1-BR.JPG', 
  'Spirit', 
  1, 
  'NAVCAM'
);