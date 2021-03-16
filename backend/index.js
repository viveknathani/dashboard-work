'use strict';

require('dotenv').config();

const express = require('express');
const app     = express();
const cors = require('cors');
const paths = require('./api/entry');
const PORT    = process.env.PORT;
app.use(express.json());
app.use(cors());

paths(app);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});