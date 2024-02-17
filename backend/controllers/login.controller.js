const { showError } = require('../lib/index');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const pool = require('../db');

require('dotenv').config();

class LoginController {
    // LOGIN CHECK
    check = async (req, res, next) => {
        try {
            // Form data
            const { email, password } = req.body;

            if (!password || !email) {
                return res.status(422).json({
                    message: "Input fields cannot be empty!"
                });
            }

            const user = await pool.query("SELECT * FROM users WHERE email = ($1)", [email]);
            if (user.rowCount == 1 && user.rows.length !== 0) {
                const data = user.rows[0];

                if (bcrypt.compareSync(password, data.password)) {
                    // Generate token
                    const token = jwt.sign({
                        id: data.user_id,
                        iat: Math.floor(Date.now / 1000),
                        exp: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60),
                    }, process.env.JWT_SECRET);

                    return res.json({ message: "Logged in successfully!", token, user: data });
                } else {
                    next({
                        message: "Invalid Password!",
                        status: 422
                    });
                }
            }

            return res.status(422).json({
                message: "Invalid email!"
            });
        } catch (error) {
            showError(error, next);
        }
    };

    // CREATE
    createUser = async (req, res, next) => {
        try {
            // get data from the form
            const { username, password, email } = req.body;

            if (!username || !password || !email) {
                return res.status(422).json({
                    message: "Input fields cannot be empty!"
                });
            }

            const check = await pool.query("SELECT * FROM users WHERE email = ($1)", [email]);

            // check whether the user already exists
            if (check.rows.length !== 0) {
                return res.status(403).json({
                    message: "User already exists!"
                });
            }

            const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

            const sql = "INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING *";
            const user = await pool.query(sql, [username, hash, email]);

            if (user.rowCount == 1 && user.rows.length !== 0) {
                return res.status(200).json({
                    message: "User registered successfully!",
                    user: user.rows
                });
            }

            return res.status(400).json({
                message: "Error while processing!"
            });
        } catch (err) {
            showError(err, next);
        }
    };
};

module.exports = new LoginController;