const router = require("express").Router();
const pool = require("../db_creation/db");
const hbs = require('nodemailer-express-handlebars');
const authorise = require("../middleware/authorise")();
const nodemailer = require('nodemailer')
const path = require('path')
const fs = require('fs');
require('dotenv').config();

var transporter = nodemailer.createTransport({
  host: "smtpout.secureserver.net",
  secure: true,
  secureConnection: false, // TLS requires secureConnection to be false
  tls: {
    ciphers: 'SSLv3'
  },
  requireTLS: true,
  port: 465,
  debug: true,
  auth: {
    user: process.env.Email,
    pass: process.env.Password
  }
});

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
      sqlquery,
      template
    } = req.body;

    console.log("started");

    const ud = await pool.query(sqlquery);

    // point to the template folder
    const handlebarOptions = {
      viewEngine: {
        partialsDir: path.resolve('./templates/'),
        defaultLayout: false,
      },
      viewPath: path.resolve('./templates/'),
    };

    // use a template file with nodemailer
    transporter.use('compile', hbs(handlebarOptions))

    result = []

    for (i = 0; i < ud.rows.length; i++) {
      console.log(ud.rows[i]);
      if (ud.rows[i].emails.split(',').length >= 1) {
        emails = ud.rows[i].emails.split(',');
        console.log(emails);
        for (j = 0; j < emails.length; j++) {
          console.log("email: " + emails[j]);
          var mailOptions = {
            from: 'Crezalo <' + process.env.Email + '>', // sender address
            to: emails[j], // list of receivers separated by comma
            subject: '₹₹₹ Earn From Your Subscribers Today with Crezalo.com - 0% Revenue Sharing!',
            template: template, // the name of the template file i.e email.handlebars
            context: {
              name: ud.rows[i].name, // replace {{name}} with Adebola
            }
          };

          // trigger the sending of the E-mail
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              result.push(error);
              return console.log(error);
            }
            console.log("Message Info: " + info.response);
          });
        }
      }
    }

    return res.send({
      isSuccessful: true,
      errorMsg: "",
      result: "success"
    });

  } catch (err) {
    res.json({
      isSuccessful: false,
      errorMsg: err.message,
      result: []
    });
  }
});

module.exports = router;