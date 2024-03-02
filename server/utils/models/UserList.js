const mongoose = require("mongoose")

const UserListSchema = new mongoose.Schema({
    UserId: {
        type: String,
        require: true
    },
    ListName: {
        type: String,
        require: true
    }
})

const UserListModel = mongoose.models.userList || mongoose.model('userList', UserListSchema);

module.exports = UserListModel