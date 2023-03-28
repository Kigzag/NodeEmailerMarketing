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

//  uploads series demo/trailer/description video
//  because seriesid is unique video can go under kigzag-video bucket and thumbnail under kigzag-video-thumbnail
router.post('/', (req, res) => {
  try {
    const {
      names,
      emails,
      template
    } = req.body;

    console.log("started");

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

    emailList = emails.split(',');
    nameList = names.split(',');

    if (nameList.length != emailList.length) {
      res.json({
        isSuccessful: false,
        errorMsg: "different number of names and emails",
        result: []
      });
    }

    result = []

    for (i = 0; i < emailList.length; i++) {
      var mailOptions = {
        from: 'Crezalo <' + process.env.Email + '>', // sender address
        to: emailList[i], // list of receivers separated by comma
        subject: '₹₹₹ Earn From Your Subscribers Today with Crezalo.com - 0% Revenue Sharing!',
        template: template, // the name of the template file i.e email.handlebars
        context: {
          name: nameList[i], // replace {{name}} with Adebola
        }
      };

      // trigger the sending of the E-mail
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          result.push(error);
          return console.log(error);
        }
        result.push(info.response);
      });
    }

    return res.send({
      isSuccessful: true,
      errorMsg: "",
      result: result
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