const pool = require("../db_creation/db");
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (optional = false) => async (req, res, next) => {
    // console.log("middleware");
    // getting a token from authorization header
    // console.log(req.headers);
    const token = req.headers['authorization'];
    // console.log(token);
    // send error message if no token is found:
    if (!token) {
        return res.send({
            isSuccessful: false,
            errorMsg: "Authentication Error: Access Token Missing!",
            result: []
        });
    } else {
        try {
            // if the incoming request has a valid token, we extract the payload from the token and attach it to the request object.
            const payload = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
            const user = payload.user;
            const {
                rows: [userProfile]
            } = await pool.query("SELECT * FROM Users WHERE UserName=$1", [user])

            if (!userProfile) {
                res.send({
                    isSuccessful: false,
                    errorMsg: "Authentication Error: User not Found",
                    result: []
                })
            }
            req.username = user;
            next();
        } catch (err) {
            if (!optional) {
                return res.send({
                    isSuccessful: false,
                    errorMsg: `Authentication Error: ${err.message}`,
                    result: []
                })
            }
        }
    }
}