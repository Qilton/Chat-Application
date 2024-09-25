const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    bio:{
        type: String
    },
    profilePic:{
        type: String
    },
});

const UserModel = mongoose.model('users', UserSchema);
module.exports = UserModel;