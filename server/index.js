const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const UsersModel = require("./utils/models/User")
const ListModel = require("./utils/models/List")
const ReviewsModel = require("./utils/models/Reviews")
const UserListModel = require("./utils/models/UserList")
const ReviewVoteModel = require("./utils/models/ReviewVote")
const SongVoteModel = require("./utils/models/SongVote")



const app = express()

app.use(cors())
app.use(express.json())

mongoose.connect("mongodb+srv://saifkhadraoui656:AYSbUIMAcBJUXXTQ@cluster0.oobrkze.mongodb.net/", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then((response) => {
    if(response){
        console.log("connected to db")
    }
})

app.post("/api/register", async(req, res) => {
    const { email, username, password } = req.body;

    const user = new UsersModel({
        email: email,
        username: username,
        password: password,
        profilePic: ""
    })

    try{
        await user.save()
        res.send("user registered")
    } catch(err){
        console.log(err)
        res.send(err)
    }
})

app.get("/api/login", async(req, res) => {
    const { username, password } = req.query

    try{
        const userExists = await UsersModel.find({ username: username, password: password })
        res.send(userExists)
    } catch(err){
        console.log(err)
        res.send(err)
    }
    
})

app.post("/api/addToList", async(req, res) => {
    const { selectedList, userId, type, animeId, img, title } = req.body

    const listItem = new ListModel({
        ListId: selectedList,
        UserId: userId,
        Type: type,
        AnimeId: animeId,
        Img: img,
        Title: title
    })

    try{
        await listItem.save()
        res.send("list item added")
    } catch(err){
        console.log(err)
        res.send(err)
    }
})

app.get("/api/getList", async(req,res) => {
    const {id} = req.query

    try{
        const data = await ListModel.find({ListId: id})
        res.send(data)
    } catch(err){
        console.log(err)
        res.send(err)
    }
})

app.get("/api/checkAdded", async(req,res) => {
    const {userId, id, selectedList} = req.query;

    try{
        const data = await ListModel.find({UserId: userId, AnimeId: id, ListId: selectedList})
        res.send(data)
    } catch(err){
        console.log(err)
        res.send(err)
    }
})

app.delete("/api/deleteFromList", async(req,res) => {
    const {id} = req.query;

    try{
        await ListModel.findOneAndDelete({ _id: id })
        res.send("Deleted from list")
    } catch(err){
        console.log(err)
        res.send(err)
    }
})

app.post("/api/createList", async(req, res) => {
    const { userId, listName } = req.body;

    const list = new UserListModel({
        UserId: userId,
        ListName: listName
    })

    try{
        await list.save()
        res.send("new list created")
    } catch(err){
        console.log(err)
        res.send(err)
    }
})

// app.post("/chat", async(req,res) => {
//     const { anime, genres } = req.body
//     console.log(anime)
//     console.log(genres)

//     console.log(`Give me just the anime title without a full sentence of an anime similar to ${anime} with genres ${genres}`)

//     const completion = await openai.chat.completions.create({
//         messages: [{ role: "system", content: `Give me just the anime title without a full sentence of an anime similar to ${anime} with the genre ${genres}`}],
//         model: "gpt-3.5-turbo",
//       });

//     console.log(completion.choices[0].message.content)

//     // res.json({
//     //     message: completion.choices[0].message
//     // })

//     res.send(completion.choices[0].message.content)
// })

app.post("/api/addReview", async(req,res) => {
    const { guest, animeId, userId, username, userPic, rating, content } = req.body

    const review = new ReviewsModel({
        Guest: guest,
        AnimeId: animeId,
        UserId: userId,
        Username: username,
        UserPic: userPic,
        Rating: rating,
        Content: content
    })

    try{
        await review.save()
        res.send("review added")
    } catch(err){
        console.log(err)
        res.send(err)
    }

})

app.get("/api/getReviews", async(req, res) => {
    const { id } = req.query;

    try{
        const data = await ReviewsModel.find({ AnimeId: id })
        res.send(data)
    } catch(err){
        console.log(err)
        res.send(err)
    }
})

app.get("/api/getAmountAdded", async(req,res) => {
    const { id } = req.query;

    try{
        const amount = await ListModel.countDocuments({AnimeId: id })
        res.send({amount})
    } catch(err){
        console.log(err)
        res.send(err)
    }
})

app.get("/api/getLists", async(req,res) => {
    const {userId} = req.query;

    try{
        // console.log("hello")
        const data = await UserListModel.find({UserId: userId})
        res.send(data)
    } catch(err){
        console.log(err)
        res.send(err)
    }
})

app.get("/api/getListItem", async(req,res) => {
    const { id } = req.query;
    // console.log(id)

    try{
        // console.log("here")
        const data = await UserListModel.find({_id: id})
        res.send(data)
    } catch(err){
        console.log(err)
        res.send(err)
    }
})

app.delete("/api/deleteList", async(req, res) => {
    const { listId } = req.query;

    try{
        const data = await UserListModel.findOneAndDelete({ _id: listId })
        res.send(data)
    } catch(err){
        console.log(err)
        res.send(err)
    }
})

app.post("/api/vote", async(req, res) => {
    const { reviewId, userId, vote } = req.body;

    const data = new ReviewVoteModel({
        ReviewId: reviewId,
        UserId: userId,
        Vote: vote
    })

    try{
        const response = await data.save()
        res.send(response)
    } catch(err){
        console.log(err)
        res.send(err)
    }
})

app.get("/api/getVotes", async(req,res) => {
    const { reviewId } = req.query;

    try{
        const upVotes = await ReviewVoteModel.find({ ReviewId: reviewId, Vote: true }).countDocuments()
        const downVotes = await ReviewVoteModel.find({ ReviewId: reviewId, Vote: false }).countDocuments()
        res.send({
            upVotes: upVotes,
            downVotes: downVotes
        })
    } catch(err){
        console.log(err)
        res.send(err)
    }
})

app.get("/api/checkIfVoted", async(req,res) => {
    const { userId, reviewId } = req.query;

    try{
        const voteOutcome = await ReviewVoteModel.find({ ReviewId: reviewId, UserId: userId })
        res.send(voteOutcome)
    } catch(err){
        console.log(err)
        res.send(err)
    }
})

app.delete("/api/deleteVote", async(req,res) => {
    const { userId, reviewId } = req.query;

    try{
        await ReviewVoteModel.findOneAndDelete({ ReviewId: reviewId, UserId: userId })
        res.send("vote on review deleted")
    } catch(err){
        res.send(err)
        console.log(err)
    }
})

app.post("/api/addSongVote", async(req, res) => {
    const { animeId, userId, basename, vote } = req.body;
    console.log(req.body)

    const data = new SongVoteModel({
        AnimeId: animeId,
        UserId: userId,
        Basename: basename,
        Vote: vote
    })

    try{
        const response = await data.save()
        res.send(response)
    } catch(err){
        console.log(err)
        res.send(err)
    }
})

app.delete("/api/deleteSongVote", async(req,res) => {
    const { userId, basename } = req.query;

    try{
        await SongVoteModel.findOneAndDelete({ Basename: basename, UserId: userId })
        res.send("vote on song deleted")
    } catch(err){
        res.send(err)
        console.log(err)
    }
})

app.get("/api/checkIfSongVoted", async(req,res) => {
    const { userId, basename } = req.query;

    try{
        const voteOutcome = await SongVoteModel.find({ Basename: basename, UserId: userId })
        res.send(voteOutcome)
    } catch(err){
        console.log(err)
        res.send(err)
    }
})

app.get("/api/getSongVotes", async(req,res) => {
    const { basename } = req.query;

    try{
        const upVotes = await SongVoteModel.find({ Basename: basename, Vote: true }).countDocuments()
        const downVotes = await SongVoteModel.find({ Basename: basename, Vote: false }).countDocuments()
        res.send({
            upVotes: upVotes,
            downVotes: downVotes
        })
    } catch(err){
        console.log(err)
        res.send(err)
    }
})

app.get("/api/getTopSongs", async(req, res) => {

    try{
        const response = await SongVoteModel.aggregate(
            {$group : { _id : '$AnimeId', count : {$sum : 1}}}
         ).result
         console.log(response)  
         res.send(response)
    } catch(err){
        console.log(err)
        res.send(err)
    }
})

app.listen(1337, () => {
    console.log("server connected")
})