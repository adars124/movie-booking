CREATE DATABASE movie;

CREATE TYPE roles AS ENUM ('admin', 'user');

-- USERS
CREATE TABLE users (
	user_id UUID DEFAULT uuid_generate_v4(),
	username VARCHAR(100) NOT NULL,
	password VARCHAR(100) NOT NULL,
	email VARCHAR(100) NOT NULL UNIQUE,
	role_name roles DEFAULT 'user',
	PRIMARY KEY (user_id)
);

CREATE TYPE movie_status AS ENUM ('available', 'unavailable');

-- MOVIES
CREATE TABLE movies
(
	movie_id UUID DEFAULT uuid_generate_v4(),
	title VARCHAR(100) NOT NULL,
	description VARCHAR(500) NOT NULL,
	poster_url VARCHAR(255),
	featured BOOLEAN,
	genre VARCHAR(100) NOT NULL,
	status movie_status,
	released_date DATE,
	PRIMARY KEY (movie_id)
);

-- SHOWTIMES
CREATE TABLE showtimes (
  showtime_id UUID DEFAULT uuid_generate_v4(),
  movie_id UUID NOT NULL,
  start_time TIMESTAMP NOT NULL,
  PRIMARY KEY (showtime_id),
  FOREIGN KEY (movie_id) REFERENCES movies(movie_id)
);

-- BOOKINGS
CREATE TABLE bookings (
    booking_id UUID DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    movie_id UUID NOT NULL,
    showtime_id UUID NOT NULL,
    booked_seats integer[],
    amount INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (booking_id),
    CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(user_id),
    CONSTRAINT fk_movie FOREIGN KEY(movie_id) REFERENCES movies(movie_id),
    CONSTRAINT fk_showtime FOREIGN KEY(showtime_id) REFERENCES showtimes(showtime_id)
);

-- SEATS
CREATE TABLE seats (
    seat_id UUID DEFAULT uuid_generate_v4(),
    showtime_id UUID NOT NULL,
    seat_number INT NOT NULL,
    is_booked BOOLEAN DEFAULT false,
    PRIMARY KEY (seat_id),
    UNIQUE (showtime_id, seat_number),
    CONSTRAINT fk_showtime FOREIGN KEY(showtime_id) REFERENCES showtimes(showtime_id)
);

-- TICKETS
CREATE TABLE tickets (
    ticket_id UUID DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL,
    expiration_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP + INTERVAL '24 hours',
    PRIMARY KEY (ticket_id),
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id)
);
