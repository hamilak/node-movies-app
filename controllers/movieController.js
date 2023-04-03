const express = require("express");
const router = express.Router();
const mongoose = require("mongoose")
const Movie = mongoose.model("Movieslist")
const movieModel = require("../models/movie.model")
const movieController = require("../controllers/movieController")

router.get('/', (req, res) =>{
    res.render("movie/addorEdit", {
        viewTitle: "Insert a new movie"
    })
});

router.post('/', (req, res)=>{
    insertRecord(req, res)
});

function insertRecord(req, res){
    const movie = new Movie();
    movie.name = req.body.name;
    movie.year = req.body.year;
    movie.rating = req.body.rating;
    movie.save()
    .then(item =>{
        return res.redirect('movie/list');
    })
    .catch(err =>{
        if(err.name === 'ValidationError'){
            handleValidationError(err, req.body)
            res.render("movie/addorEdit", {
                viewTitle: "Insert a movie",
                movie: req.body
            })
        }
        else{
            console.log("unable to save data")
        }
        
    })
}

router.get('/list', async (req, res, next) =>{
    let movies = movieModel.movies;

    let movieResult = await movies.find({}).exec({err, moviesData} ={
        if(moviesData){
            res.render("movie/list", {data:moviesData})
        }
    })
})

function handleValidationError(err, body){
    for(field in err.errors){
        switch (err.errors[field].path){
            case 'name':
                body['nameError'] = err.errors[field].message;
                break;
            case 'year':
                body['yearError'] = err.errors[field].message;
                break;
            case 'rating':
                body['ratingError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}

module.exports = router