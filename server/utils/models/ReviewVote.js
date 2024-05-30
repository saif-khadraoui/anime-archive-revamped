
const mongoose = require("mongoose")

const ReviewVoteSchema = new mongoose.Schema({
    ReviewId: {
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

const ReviewVoteModel = mongoose.models.reviewVote || mongoose.model('reviewVote', ReviewVoteSchema);

module.exports = ReviewVoteModel;