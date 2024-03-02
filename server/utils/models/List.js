const mongoose = require("mongoose")

const ListSchema = new mongoose.Schema({
    ListId: {
        type: String,
        require: true
    },
    UserId: {
        type: String,
        require: true
    },
    Type: {
        type: String,
        require: true
    },
    AnimeId: {
        type: String,
        require: true
    },
    Img: {
        type: String,
        require: true
    },
    Title: {
        type: String,
        require: true
    }
})

const ListModel = mongoose.models.list || mongoose.model('list', ListSchema);

module.exports = ListModel