CREATE TABLE test_table (
    id SERIAL PRIMARY KEY,
    content text NOT NULL,
    important boolean,
    date time
);

insert into test_table (content, important) values ('This is test text', true);
insert into test_table (content, important) values ('Another text to test', false);