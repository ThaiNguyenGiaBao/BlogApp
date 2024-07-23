const express = require("express");
const bcrypt = require("bcrypt");
const verifyToken = require("../utils/verifyToken");
const User = require("../models/user");

const route = express.Router(); 
route.put("/update/:userid", verifyToken, async (req, res) => {

    if(req.user.id == req.params.userid) {
        //console.log("User is updating his own data");
        //console.log(req.body);
        if(req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }
        try {
            const updatedUser = await User.findByIdAndUpdate(req.params.userid, {
                $set: {
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password,
                    avatar: req.body.avatar
                }
            }, {new: true});
            
            const {password, ...rest} = updatedUser._doc;
            res.status(200).json(rest);
        }
        catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    }
    else {
        res.status(401).json("You can update only your account");
    
    }
});



// Authenticate user
const updateUser =  async (req, res, next) => {

}

module.exports = route;