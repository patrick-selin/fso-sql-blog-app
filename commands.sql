-- 12.2
CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author TEXT,
    url TEXT NOT NULL,
    title TEXT NOT NULL,
    likes INTEGER DEFAULT 0
);

INSERT INTO blogs (author, url, title, likes)
VALUES ('Jukka Poika', 'https://www.huu.com/blog1', 'Eka Blog', 10);

INSERT INTO blogs (author, url, title, likes)
VALUES ('Jaana Tyyppi', 'https://www.yle.fi/blog2', 'Toka Blog', 5);

INSERT INTO blogs (author, url, title, likes)
VALUES ('Hello Man', 'https://www.yle.fi/blog3', 'Kolmas Blog', 34);

-- 12.3