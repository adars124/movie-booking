const pool = require('../db');
const { formatDate, createSignature } = require('../lib');

class BookingController {
    // CREATE Order
    createOrder = async (req, res, next) => {
        try {
            // console.log(req.body);
            const { data } = req.body;
            const amount = data.amount;
            const movie_id = data.movie_id;
            const uuid = performance.now();

            const id = `${uuid}`.replace(".", "-");

            const signature = createSignature(
                `total_amount=${amount},transaction_uuid=${id},product_code=EPAYTEST`
            );

            const formData = {
                amount: amount,
                failure_url: "http://localhost:5173/failure",
                product_delivery_charge: "0",
                product_service_charge: "0",
                product_code: "EPAYTEST",
                signature: signature,
                signed_field_names: "total_amount,transaction_uuid,product_code",
                success_url: `http://localhost:5173/${movie_id}/success`,
                tax_amount: "0",
                total_amount: amount,
                transaction_uuid: id
            };

            return res.json({
                message: "Order Created",
                formData
            });
        } catch (err) {
            return res.status(400).json({
                message: err.message
            });
        }
    }

    // Booking Create
    createBooking = async (req, res, next) => {
        if (req.user == undefined) {
            return res.status(401).json({
                message: "Please login to continue!"
            });
        }

        const client = await pool.connect();
        const { bookedSeats, showtime_id } = req.body;
        const movie_id = req.params.id;

        try {
            await client.query("BEGIN");

            // Availibility check
            const checkQuery = "SELECT * FROM seats WHERE showtime_id = ($1) AND seat_number = ANY($2) AND is_booked = false";
            const checkResult = await client.query(checkQuery, [showtime_id, bookedSeats]);
            // console.log("HERE IS THE OUTPUT: ", checkResult);

            // If all seats are available, proceed with booking
            if (checkResult.rowCount === bookedSeats.length) {
                // Insert into the bookings table
                const insertBookingQuery = 'INSERT INTO bookings (user_id, showtime_id, movie_id, booked_seats, amount) VALUES ($1, $2, $3, $4, $5) RETURNING booking_id';
                const bookingResult = await client.query(insertBookingQuery, [req.user.user_id, showtime_id, movie_id, bookedSeats, calculateBookingAmount(bookedSeats)]);
                const bookingId = bookingResult.rows[0].booking_id;
                let ticket;

                // Set the status of seats to true
                const updateQuery = 'UPDATE seats SET is_booked = TRUE WHERE showtime_id = ($1) AND seat_number = ANY($2) RETURNING *';
                const updateResult = await client.query(updateQuery, [showtime_id, bookedSeats]);

                if (updateResult.rows.length !== 0) {
                    console.log('THE STATUS OF THE SEATS ARE UPDATED!');
                    const showtime = await client.query('SELECT * FROM showtimes WHERE movie_id = ($1)', [movie_id]);

                    const expiry = new Date(showtime.rows[0].start_time);
                    expiry.setHours(expiry.getHours() + 24);
                    const expiry_date = formatDate(expiry);

                    if (showtime.rows.length !== 0) {
                        ticket = await client.query("INSERT INTO tickets (booking_id, expiration_time) VALUES ($1, $2) RETURNING *", [bookingId, expiry_date]);
                        // If successful, commit the transaction
                        await client.query("COMMIT");
                    } else {
                        throw new Error('Showtime not found!');
                    }
                } else {
                    throw new Error('Seat update failed!');
                }
                return res.status(200).json({ message: 'Seats booked successfully!', ticket: ticket.rows[0] });
            } else {
                throw new Error('Selected seats are not available!');
            }
        } catch (err) {
            // If an error occurs, rollback the transaction
            await client.query("ROLLBACK");
            return res.status(400).json({
                message: err.message
            });
        } finally {
            client.release();
        }

        function calculateBookingAmount(seats) {
            const price = 200;
            return seats.length * price;
        }
    };

    // GET seats
    fetchSeats = async (req, res, next) => {
        try {
            const showtime_id = req.params.id;
            const sql = "SELECT * FROM seats WHERE showtime_id = $1";
            const query = await pool.query(sql, [showtime_id]);

            if (query.rows.length !== 0) {
                return res.status(200).json({
                    message: "Success",
                    seats: query.rows
                })
            }

            throw Error('Error while fetching seats!');
        } catch (err) {
            return res.status(400).json({
                message: err.message
            });
        }
    };

    // GET showtimes
    fetchShowtimes = async (req, res, next) => {
        try {
            const movie_id = req.params.id;
            const sql = "SELECT * FROM showtimes WHERE movie_id = ($1)";
            const query = await pool.query(sql, [movie_id]);

            if (query.rows.length !== 0) {
                return res.status(200).json({
                    message: "Success",
                    showtimes: query.rows
                })
            }
            throw Error('Showtime not found for given movie!');
        } catch (err) {
            return res.status(404).json({
                message: err.message
            });
        }
    }
};

module.exports = new BookingController;