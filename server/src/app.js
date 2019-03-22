const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const routes = require('./routes');
const mongoose = require('mongoose');
const config = require('./config/config');

const app = express();

app.use(morgan('combined'));
app.use(bodyParser.json({limit: '10mb'}));
app.use(cors());

routes(app);

// Connect to the db
mongoose.connect(config.database.url);

app.listen(config.port);
console.log(`Server running at port: ${config.port}`);