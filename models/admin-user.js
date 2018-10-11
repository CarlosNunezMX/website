/*

admin-user.js -
file containing the model file for admin user

*/

const mongoose = require("mongoose"),
    uniqueValidator = require("mongoose-unique-validator"),
    bcrypt = require("bcrypt");

const adminUserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required."],
        minlength: [1, "Username must be at-least 1 character."],
        maxlength: [42, "Username cannot be more than 42 characters long."],
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, "Password is required."],
        minlength: [7, "Password must be at-least 7 characters."],
        maxlength: [256, "Password cannot be more than 256 characters long."],
        trim: true,
    }
});

adminUserSchema.plugin(uniqueValidator, {message: "{PATH} already in use."});

adminUserSchema.pre("save", function(next) {
    // only hash the password if it has been modified (or is new)
    if (!this.isModified("password")) {
        return next();
    }

    // Hash the password with 10 rounds.
    bcrypt.hash(this.get("password"), 10, (err, hash) => {
        if (err) {
            return next(err);
        }

        this.set("password", hash);
        next();
    });
});

adminUserSchema.statics.findByUsername = function(username) {
    return this.model("adminUser").findOne({
        username
    });
};

const adminUserModel = mongoose.model("adminUser", adminUserSchema);

module.exports = {
    adminUserModel,
    adminUserSchema
};