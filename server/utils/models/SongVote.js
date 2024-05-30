
const mongoose = require("mongoose")

const SongVoteSchema = new mongoose.Schema({
    Basename: {
        type: String,
        require: true
    },
    AnimeId: {
        type: String,
        require: true
    },
    UserId: {
        type: String,
        require: false
    },
    Vote: {
        type: Boolean,
        require: true
    },
 
}, {timestamps: true})

const SongVoteModel = mongoose.models.songVote || mongoose.model('songVote', SongVoteSchema);

module.exports = SongVoteModel;