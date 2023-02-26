const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require("../connectionAndSchemas/loginSchema");
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const secret = process.env.SECRET;

router.use(bodyParser.json());

router.post("/signup", body('email').isEmail(), 
    body("password").isLength({ min: 6, max: 16 }),
     async (req, res) => {

        try {
            // Finds the validation errors in this request and wraps them in an object with handy functions
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const {email, password} = req.body;
            // check whether user is already registered
            
            let user = await User.findOne({ email });

            if (user) {
                return res.status(401).json({
                    status: "Failed",
                    message: "Email already exists"
                });
            }

            bcrypt.hash(password, 10, async function (err, hash) {
                if (err) {
                    return res.status(400).json({
                        status: "Failed",
                        message: err.message
                    });
                }

                const user = await User.create({
                    email,
                    password: hash,
                })
                return res.json({
                    status: "success",
                    message: "Registration succesful",
                    user
                })

            });

        } catch (e) {
            res.status(500).json({
                status: "failed",
                message: e.message
            })
        }
    });

router.post("/login", body('email').isEmail(), async (req, res) => {

    try {
        // Finds the validation errors in this request and wraps them in an object with handy functions
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        let user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                status: "Failed",
                message: "User doesnt exists"
            });
        }

        // Load hash from your password DB.
        bcrypt.compare(password, user.password, function (err, result) {
            // result == true
            if (err) {
                return res.status(500).json({
                    status: "Failed",
                    message: err.message
                });
            }
            if (result) {
                // token will be used to track the user for further operation
                const token = jwt.sign({
                    exp: Math.floor(Date.now() / 1000) + (60 * 60),
                    data: user._id
                  }, secret);
        

                res.status(200).json({
                    status: "Sucess",
                    message: "Login successful ",
                    token
                });
            } else {
                res.status(401).json({
                    status: "Falied",
                    message: "Invalid credentials !! Please provide correct email/password"
                });
            }
        });

    } catch (e) {
        res.status(500).json({
            status: "failed",
            message: e.message
        })
    }
});

router.get("/login/:email", async(req, res) => {
    try {
      let data = await User.find({email:req.params.email});
      res.send(data);
    } catch (e) {
      res.status(404).json({
        status: "Failed",
        message: e.message,
      });
    }
  });
module.exports = router;



