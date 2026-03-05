-- DB作成
CREATE DATABASE sample_db;

-- 作成したDBに接続
\c sample_db;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- テーブル作成
CREATE TABLE users (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
	created_date_time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE tasks (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	name VARCHAR(100) NOT NULL,
    goal_time integer NOT NULL,
    sum_time integer NOT NULL,
    online_member_count integer NOT NULL,
	created_date_time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE members (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    task_id UUID NOT NULL,
    sum_time integer NOT NULL,
	created_date_time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES tasks(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(user_id, task_id)
);

CREATE TABLE times (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID NOT NULL,
	name VARCHAR(100) NOT NULL,
    start_time TIMESTAMP NOT NULL,
	end_time TIMESTAMP,
	created_date_time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES members(id)
);

-- indexを貼る
CREATE INDEX idx_members_user_id ON members(user_id);
CREATE INDEX idx_members_task_id ON members(task_id);
CREATE INDEX idx_times_member_id ON times(member_id);

INSERT INTO users (name, email, password)
VALUES
('User1', 'user1@example.com', 'password1'),
('User2', 'user2@example.com', 'password2'),
('User3', 'user3@example.com', 'password3'),
('User4', 'user4@example.com', 'password4');