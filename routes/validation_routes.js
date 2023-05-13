const router = require("express").Router();
const pool = require("../db_creation/db");
const hbs = require('nodemailer-express-handlebars');
const authorise = require("../middleware/authorise")();
const nodemailer = require('nodemailer')
const path = require('path')
const fs = require('fs');
require('dotenv').config();

router.get('/', (req, res) => {
  try {
    return res.send({
      isSuccessful: true,
      errorMsg: "",
      result: "Node Mailer On!!!"
    });
  } catch (err) {
    res.json({
      isSuccessful: false,
      errorMsg: err.message,
      result: []
    });
  }
});

// template : generic , ..
// table : marketing , marketingDummy
// SQL query to select data from table

router.post('/', async (req, res) => {
  try {
    const {
      idea,
      email
    } = req.body;

    const ud = await pool.query("INSERT INTO Saas_Validation (Idea, Email) VALUES ($1,$2) RETURNING*;", [idea, email]);
    if (ud.rows[0]) {
      return res.send({
        isSuccessful: true,
        errorMsg: "",
        result: "success"
      });
    } else {
      return res.send({
        isSuccessful: true,
        errorMsg: "",
        result: "Unable To Insert"
      });

    }
  } catch (err) {
    console.log(err);
    res.json({
      isSuccessful: false,
      errorMsg: err.message,
      result: []
    });
  }
});

module.exports = router;