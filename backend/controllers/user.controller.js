const { showError } = require('../lib/index');
const bcrypt = require('bcryptjs');
const pool = require('../db');

class UserController {

    // READ
    getAllUsers = async (req, res, next) => {
        try {
            const sql = "SELECT * FROM users ORDER BY user_id";
            const users = await pool.query(sql);

            return res.status(200).json({
                message: "OK",
                users: users.rows
            });
        } catch (err) {
            showError(err, next);
        }
    };

    // CREATE
    addUser = async (req, res, next) => {
        try {
            // get data from the form
            const { username, password, email, role_name } = req.body;

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

            const role = role_name === "admin" ? "admin" : "user";

            const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

            const sql = "INSERT INTO users (username, password, email, role_name) VALUES ($1, $2, $3, $4) RETURNING *";
            const user = await pool.query(sql, [username, hash, email, role]);

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

    // UPDATE
    updateUser = async (req, res, next) => {

        try {
            const { username, password, email, role_name } = req.body;
            const user_id = req.params.id;

            if (!username || !password || !email) {
                return res.status(422).json({
                    message: "Invalid Inputs!"
                });
            }

            const check = "SELECT * FROM users WHERE user_id = ($1)";
            const found = await pool.query(check, [user_id]);

            if (found.rowCount === 1 && found.rows.length !== 0) {

                const role = role_name === "admin" ? "admin" : "user";

                const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

                const sql = "UPDATE users SET username = ($1), password = ($2), email = ($3), role_name = ($4) WHERE user_id = ($5) RETURNING *";

                const data = await pool.query(sql, [username, hash, email, role, user_id]);

                if (data.rowCount === 1 && data.rows.length !== 0) {
                    return res.status(201).json({
                        message: "Updated successfully!",
                        user: data.rows
                    });
                }

            }

            return res.status(400).json({
                message: "Invalid user id!"
            });
        } catch (err) {
            showError(err, next);
        }

    };

    // READ by ID
    getUserById = async (req, res, next) => {
        try {
            const user_id = req.params.id;

            const sql = "SELECT * FROM users WHERE user_id = ($1)";
            const data = await pool.query(sql, [user_id]);

            if (data.rowCount == 1 && data.rows.length !== 0) {
                return res.status(200).json({
                    message: "OK",
                    user: data.rows
                });
            }

            return res.status(404).json({
                message: "User not found with associated ID!"
            });
        } catch (err) {
            showError(err, next);
        }
    };

    // DELETE
    deleteUser = async (req, res, next) => {
        try {
            const user_id = req.params.id;

            const sql = "DELETE FROM users WHERE user_id = ($1)";
            const data = await pool.query(sql, [user_id]);

            if (data.rowCount == 1) {
                return res.json({
                    message: "User deleted successfully!"
                });
            }

            return res.status(404).json({
                message: "User not found!"
            });
        } catch (err) {
            showError(err, next);
        }
    };
}

module.exports = new UserController;