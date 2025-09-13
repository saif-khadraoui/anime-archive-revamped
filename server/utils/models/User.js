const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        require: true
    },
    password: {
        type: String,
        required: true
    },
    profilePic: {
        type: String,
        required: false
    },
    bio: {
        type: String,
        required: false
    },
    location: {
        type: String,
        required: false
    },
    joinDate: {
        type: Date,
        required: false
    },
    favoriteAnime: [{
        animeId: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: false
        },
        type: {
            type: String,
            required: false,
            default: "Anime"
        },
        addedDate: {
            type: Date,
            default: Date.now
        }
    }]

})


const UsersModel = mongoose.models.users || mongoose.model('users', UserSchema);

module.exports = UsersModel