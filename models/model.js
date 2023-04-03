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

movies = mongoose.model("Movieslist", movieSchema);

