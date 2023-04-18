const express = require('express');
const expressListRoutes = require('express-list-routes');
const fs = require('fs');
const cors = require('cors');
require("express-async-errors");
const emailRoutes = require("./routes/email_routes");

const app = express();

app.use(cors({
  origin: '*',
}));
app.use(express.json());
app.use("/", emailRoutes);

app.listen(5001, function () {
  console.log('Node Mailing Server is listening on port 5001!')
});

// Lists all routes for port 4000
// expressListRoutes(app, {
//   prefix: '/'
// });