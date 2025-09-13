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

    try{
        // Check if email already exists
        const existingEmail = await UsersModel.findOne({ email: email });
        if (existingEmail) {
            return res.status(400).json({
                success: false,
                message: "An account with this email already exists. Please use a different email or try logging in."
            });
        }

        // Check if username already exists
        const existingUsername = await UsersModel.findOne({ username: username });
        if (existingUsername) {
            return res.status(400).json({
                success: false,
                message: "This username is already taken. Please choose a different username."
            });
        }

        // Create new user if validation passes
        const user = new UsersModel({
            email: email,
            username: username,
            password: password,
            profilePic: "",
            joinDate: new Date()
        });

        await user.save();
        
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                _id: user._id,
                email: user.email,
                username: user.username
            }
        });
    } catch(err){
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Registration failed. Please try again.",
            error: err.message
        });
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
        // Get top 10 songs by likes (positive votes)
        const topSongs = await SongVoteModel.aggregate([
            {
                $match: { Vote: true } // Only count positive votes (likes)
            },
            {
                $group: { 
                    _id: '$Basename', 
                    likes: { $sum: 1 },
                    animeId: { $first: '$AnimeId' }
                }
            },
            {
                $sort: { likes: -1 } // Sort by likes descending
            },
            {
                $limit: 10 // Get top 10
            }
        ])
        
        // Fetch anime names for each song
        const songsWithAnimeNames = await Promise.all(
            topSongs.map(async (song) => {
                try {
                    // Fetch anime data from external API
                    const animeResponse = await fetch(`https://api.animethemes.moe/anime?include=animesynonyms,series,animethemes,animethemes.animethemeentries.videos,animethemes.song,animethemes.song.artists,studios,images,resources&fields%5Banime%5D=id,name,slug,year&filter%5Bhas%5D=resources&filter%5Bsite%5D=myanimelist&filter%5Bexternal_id%5D=${song.animeId}`)
                    const animeData = await animeResponse.json()
                    
                    const animeName = animeData.anime?.[0]?.name || `Anime ID: ${song.animeId}`
                    
                    // Clean song name (remove .webm extension and format)
                    const cleanSongName = song._id
                        .replace(/\.webm$/i, '') // Remove .webm extension
                        .replace(/_/g, ' ') // Replace underscores with spaces
                        .replace(/\b\w/g, l => l.toUpperCase()) // Capitalize first letter of each word
                    
                    return {
                        ...song,
                        animeName: animeName,
                        cleanSongName: cleanSongName
                    }
                } catch (error) {
                    console.error(`Error fetching anime data for ID ${song.animeId}:`, error)
                    return {
                        ...song,
                        animeName: `Anime ID: ${song.animeId}`,
                        cleanSongName: song._id
                            .replace(/\.webm$/i, '')
                            .replace(/_/g, ' ')
                            .replace(/\b\w/g, l => l.toUpperCase())
                    }
                }
            })
        )
        
        console.log("Top songs with anime names:", songsWithAnimeNames)
        res.json({
            success: true,
            topSongs: songsWithAnimeNames
        })
    } catch(err){
        console.log(err)
        res.status(500).json({
            success: false,
            message: "Error fetching top songs",
            error: err.message
        })
    }
})

app.get("/api/getUserDetails", async(req, res) => {
    const { userId } = req.query;

    try{
        const user = await UsersModel.findById(userId)
        if(user){
            res.send({
                _id: user._id,
                username: user.username,
                email: user.email,
                profilePic: user.profilePic,
                bio: user.bio || "",
                location: user.location || "",
                joinDate: user.joinDate || new Date()
            })
        } else {
            res.status(404).send("User not found")
        }
    } catch(err){
        console.log(err)
        res.status(500).send(err)
    }
})

app.get("/api/getUserStats", async(req, res) => {
    const { userId } = req.query;

    try{
        // Get lists created by user
        const listsCount = await UserListModel.countDocuments({ UserId: userId })
        
        // Get reviews written by user
        const reviewsCount = await ReviewsModel.countDocuments({ UserId: userId })
        
        // Get anime/manga items in user's lists
        const animeInLists = await ListModel.countDocuments({ UserId: userId, Type: "Anime" })
        const mangaInLists = await ListModel.countDocuments({ UserId: userId, Type: "Manga" })
        
        res.send({
            listsCreated: listsCount,
            reviewsWritten: reviewsCount,
            animeInLists: animeInLists,
            mangaInLists: mangaInLists,
            totalItemsInLists: animeInLists + mangaInLists
        })
    } catch(err){
        console.log(err)
        res.status(500).send(err)
    }
})

// Edit user profile endpoint
app.put("/api/editProfile", async(req, res) => {
    const { userId, bio, location } = req.body;
    try{
        const user = await UsersModel.findById(userId);
        if(user){
            // Update bio and location if provided
            if(bio !== undefined) user.bio = bio;
            if(location !== undefined) user.location = location;
            
            await user.save();
            console.log("user profile updated")
            
            res.send({
                success: true,
                message: "Profile updated successfully",
                user: {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    profilePic: user.profilePic,
                    bio: user.bio,
                    location: user.location
                }
            });
        } else {
            res.status(404).send({
                success: false,
                message: "User not found"
            });
        }
    } catch(err){
        console.log(err);
        res.status(500).send({
            success: false,
            message: "Error updating profile",
            error: err.message
        });
    }
});

// Add anime to favorites endpoint
app.post("/api/addToFavorites", async(req, res) => {
    const { userId, animeId, title, image, type } = req.body;
    try{
        const user = await UsersModel.findById(userId);
        if(user){
            // Check if anime is already in favorites
            const existingFavorite = user.favoriteAnime.find(fav => fav.animeId === animeId);
            
            if(existingFavorite){
                res.status(400).send({
                    success: false,
                    message: "Anime already in favorites"
                });
                return;
            }
            
            // Add to favorites
            user.favoriteAnime.push({
                animeId: animeId,
                title: title,
                image: image,
                type: type || "Anime",
                addedDate: new Date()
            });
            
            await user.save();
            
            res.send({
                success: true,
                message: "Anime added to favorites",
                favorites: user.favoriteAnime
            });
        } else {
            res.status(404).send({
                success: false,
                message: "User not found"
            });
        }
    } catch(err){
        console.log(err);
        res.status(500).send({
            success: false,
            message: "Error adding to favorites",
            error: err.message
        });
    }
});

// Remove anime from favorites endpoint
app.delete("/api/removeFromFavorites", async(req, res) => {
    const { userId, animeId } = req.body;
    try{
        const user = await UsersModel.findById(userId);
        if(user){
            // Remove from favorites
            user.favoriteAnime = user.favoriteAnime.filter(fav => fav.animeId !== animeId);
            
            await user.save();
            
            res.send({
                success: true,
                message: "Anime removed from favorites",
                favorites: user.favoriteAnime
            });
        } else {
            res.status(404).send({
                success: false,
                message: "User not found"
            });
        }
    } catch(err){
        console.log(err);
        res.status(500).send({
            success: false,
            message: "Error removing from favorites",
            error: err.message
        });
    }
});

// Get user's favorite anime endpoint
app.get("/api/getFavorites", async(req, res) => {
    const { userId } = req.query;
    try{
        const user = await UsersModel.findById(userId);
        if(user){
            res.send({
                success: true,
                favorites: user.favoriteAnime || []
            });
        } else {
            res.status(404).send({
                success: false,
                message: "User not found"
            });
        }
    } catch(err){
        console.log(err);
        res.status(500).send({
            success: false,
            message: "Error fetching favorites",
            error: err.message
        });
    }
});

// Get public user details endpoint (no sensitive data)
app.get("/api/getPublicUserDetails", async(req, res) => {
    const { username } = req.query;
    try{
        const user = await UsersModel.findOne({ username: username })
        if(user){
            res.send({
                _id: user._id,
                username: user.username,
                profilePic: user.profilePic,
                bio: user.bio || "",
                joinDate: user.joinDate || new Date()
                // Note: email is not included for privacy
            })
        } else {
            res.status(404).send("User not found")
        }
    } catch(err){
        console.log(err)
        res.status(500).send(err)
    }
})

// Get public user statistics endpoint
app.get("/api/getPublicUserStats", async(req, res) => {
    const { username } = req.query;
    try{
        // First get the user to get their userId
        const user = await UsersModel.findOne({ username: username })
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }
        
        const userId = user._id
        
        // Get lists created by user
        const listsCount = await ListModel.countDocuments({ UserId: userId })
        
        // Get reviews written by user
        const reviewsCount = await ReviewsModel.countDocuments({ UserId: userId })
        
        // Get anime/manga items in user's lists
        const animeInLists = await ListModel.countDocuments({ UserId: userId, Type: "Anime" })
        const mangaInLists = await ListModel.countDocuments({ UserId: userId, Type: "Manga" })
        
        res.send({
            listsCreated: listsCount,
            reviewsWritten: reviewsCount,
            animeInLists: animeInLists,
            mangaInLists: mangaInLists,
            totalItemsInLists: animeInLists + mangaInLists
        })
    } catch(err){
        console.log(err)
        res.status(500).send(err)
    }
})

// Get public user's favorite anime endpoint
app.get("/api/getPublicFavorites", async(req, res) => {
    const { username } = req.query;
    try{
        const user = await UsersModel.findOne({ username: username });
        if(user){
            res.send({
                success: true,
                favorites: user.favoriteAnime || []
            });
        } else {
            res.status(404).send({
                success: false,
                message: "User not found"
            });
        }
    } catch(err){
        console.log(err);
        res.status(500).send({
            success: false,
            message: "Error fetching favorites",
            error: err.message
        });
    }
});


app.listen(1337, () => {
    console.log("server connected")
})