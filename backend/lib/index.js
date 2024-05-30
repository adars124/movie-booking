const jwt = require('jsonwebtoken');
const pool = require('../db');
const crypto = require('crypto');

const showError = (err, next) => {
    console.log(err);
    next({
        message: 'Internal server error!',
        status: 500
    });
};

const createSignature = (message) => {
    const secret = "8gBm/:&EnhH.1/q"; //different in production
    // Create an HMAC-SHA256 hash
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(message);

    // Get the digest in base64 format
    const hashInBase64 = hmac.digest("base64");
    return hashInBase64;
};

// Authentication funtion
const auth = async (req, res, next) => {
    if ('authorization' in req.headers) {
        const token = req.headers.authorization.split(" ")[1];

        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            const user = await pool.query("SELECT * FROM users WHERE user_id = ($1)", [payload.id]);

            if (user.rowCount == 1 && user.rows.length !== 0) {
                const data = user.rows[0];
                if (data.role_name === "admin") {
                    req.user = data;
                    next();
                } else {
                    next({
                        message: "Unauthorized!",
                        status: 403
                    });
                }
            } else {
                next({
                    message: "Invalid token!",
                    status: 401
                });
            }
        } catch (err) {
            next({
                message: "Invalid token!",
                status: 401
            })
        }
    }
};

const isLoggedIn = async (req, res, next) => {
    if ('authorization' in req.headers) {
        const token = req.headers.authorization.split(" ")[1];
        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            const user = await pool.query("SELECT * FROM users WHERE user_id = ($1) LIMIT 1", [payload.id]);

            if (user.rowCount === 1 && user.rows.length !== 0) {
                const data = user.rows[0];
                console.log('Logged in!');
                req.user = data;
                next();
            } else {
                next({
                    message: "User not found!",
                    status: 404
                });
            }
        } catch (err) {
            next({
                message: "Invalid token!",
                status: 401
            });
        }
    }
};


const handleEsewaSuccess = async (req, res, next) => {
    try {
        const { data } = req.query;
        // console.log(data);
        const decodedData = JSON.parse(
            Buffer.from(data, "base64").toString("utf-8")
        );
        // console.log(decodedData);

        if (decodedData.status !== "COMPLETE") {
            return res.status(400).json({ messgae: "errror" });
        }
        const message = decodedData.signed_field_names
            .split(",")
            .map((field) => `${field}=${decodedData[field] || ""}`)
            .join(",");
        // console.log(message);
        const signature = createSignature(message);

        if (signature !== decodedData.signature) {
            res.json({ message: "integrity error" });
        }

        req.transaction_uuid = decodedData.transaction_uuid;
        req.transaction_code = decodedData.transaction_code;
        next();
    } catch (err) {
        console.log(err);
        return res.status(400).json({ error: err.message || "No Orders found" });
    }
}

function formatDate(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

module.exports = { showError, handleEsewaSuccess, auth, isLoggedIn, formatDate, createSignature };
