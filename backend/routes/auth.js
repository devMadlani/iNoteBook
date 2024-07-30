const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
var jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchUser");
const router = express.Router();
const JWT_SECRET = "Devisgoodb$oy";


// Route-1 Create a user using :POST "/api/auth/createuser" . no login required

router.post(
    "/createuser",
    [
        body("name", "Enter a valid name").isLength({ min: 3 }),
        body("email", "Enter a valid email").isEmail(),
        body("password", "password must be 5 letters").isLength({ min: 5 }),
    ],
    async (req, res) => {
        let success = false;
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json({success, errors: error.array() });
        }
        // checks whether the user with this email is exists already
        try {
            let user = await User.findOne({ email: req.body.email });
            if (user) {
                return res
                    .status(400)
                    .json({success, error: "Sorry the user with this email already exists" });
            }
            const salt = await bcrypt.genSalt(10);
            const secPass = await bcrypt.hash(req.body.password, salt);
            //create a new user
            user = await User.create({
                name: req.body.name,
                password: secPass,
                email: req.body.email,
            });
            const data = {
                user: {
                    id: user.id,
                },
            };
            const authToken = jwt.sign(data, JWT_SECRET);
            success=true
            res.json({ success, authToken });
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error");
        }
    }
);
//Route-2 Aythenticate a user using :POST "/api/auth/login" . no login required
router.post(
    "/login",
    [
        body("email", "Enter a valid email").isEmail(),
        body("password", "password cannot be blank").exists(),
    ],
    async (req, res) => {
        let success = false
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json({success, errors: error.array() });
        }


        const { email, password } = req.body;
        try {

            let user = await User.findOne({ email });

            if (!user) {
                return res
                    .status(400)
                    .json({success, error: "Please try to login with correct credentials" });
            }

            const passwordCompare = await bcrypt.compare(password, user.password);

            if (!passwordCompare) {
               
                return res.status(400).json({ success, error: "Please try to login with correct credentials" });
            }

            const data = {
                user: {
                    id: user.id,
                },
            };

            const authToken = jwt.sign(data, JWT_SECRET);
            success = true;
            res.json({ success, authToken });
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error");
        }
    }
);
//Route-3 Get logged in user details Using :POST "/api/auth/getuser" . Login required
router.post('/getuser', fetchuser, async (req, res) => {

    try {
        const userId = req.user.id;
        console.log(req.user.id)
        const user = await User.findById(userId).select("-password")
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.send(user)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})
module.exports = router
