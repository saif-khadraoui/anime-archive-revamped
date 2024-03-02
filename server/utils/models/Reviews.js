
const mongoose = require("mongoose")

const ReviewSchema = new mongoose.Schema({
    Guest: {
        type: Boolean,
        require: true
    },
    AnimeId: {
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
    Rating: {
        type: Number,
        require: true
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

const ReviewsModel = mongoose.models.reviews || mongoose.model('reviews', ReviewSchema);

module.exports = ReviewsModel;