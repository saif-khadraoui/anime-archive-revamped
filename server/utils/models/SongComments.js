
const mongoose = require("mongoose")

const SongCommentsSchema = new mongoose.Schema({
    Guest: {
        type: Boolean,
        require: true
    },
    SongBasename: {
        type: String,
        require: true
    },
    Username: {
        type: String,
        require: false
    },
    UserId: {
        type: String,
        require: false
    },
    UserPic: {
        type: String,
        require: false
    },
    Content: {
        type: String,
        require: true
    },
    Date: {
        type: Date
    }
    // Upvotes: {
    //     type: Number,
    //     require: false
    // }, 
    // Downvotes: {
    //     type: Number,
    //     require: false
    // }
}, {timestamps: true})

const SongCommentsModel = mongoose.models.songComments || mongoose.model('songComments', SongCommentsSchema);

module.exports = SongCommentsModel;