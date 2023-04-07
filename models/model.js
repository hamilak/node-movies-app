const mongoose = require("mongoose")

const movieSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'This field is required'
    },
    year: {
        type: Number,
        required: 'This field is required'
    },
    rating: {
        type: Number,
        required: 'This field is required'
    }
});

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required:true,
        required: 'This field is required'
    },
    email: {
        type: String,
        required: true,
        required: 'This field is required'
    },
    password: {
        type: String,
        required:true,
        required: 'This field is required'
    }
})

const movies = mongoose.model("Movieslist", movieSchema);
const user = new mongoose.model("Users", userSchema)

mySchemas = {"movies": movies, "user": user}

module.exports = mySchemas