let mongoose = require('mongoose');
let Schema = mongoose.Schema

let User = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: Number,
    address: String
}, { usePushEach: true })

module.exports = mongoose.model('User', User);
