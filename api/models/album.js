const mongoose = require("mongoose");

const albumSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: String,
    artist: String
});

module.exports = mongoose.model("Album", albumSchema);