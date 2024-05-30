const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();

require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

// ROUTES
app.use(routes);

// ERROR HANDLING
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        error: err.message || 'Some internal error in the server!!',
    })
});

app.listen(process.env.PORT, async () => {
    console.log(`Server started at: http://localhost:${process.env.PORT}`);
    console.log("Press CTRL + c to exti.");
    console.log("DB Connected!");
})