const express = require("express");
const router = express.Router();
const mongoose = require("mongoose")
const movieModel = require("../models/model")
const Movie = mongoose.model("Movieslist")
const movieController = require("../controllers/movieController")
const scrapedMovies = require("../config/allMovies.json")

router.get('/home', (req, res) =>{
    res.render('layouts/mainlayout')
})

router.get('/login', (req, res)=>{
    res.render('layouts/login')
})

router.post('/login', async(req, res) =>{
    const user = movieModel.user

    try{
        const check= await user.findOne({name:req.body.name})

        if (check.password === req.body.password){
            res.render("home")
        }
        else{
            res.send("Wrong password")
        }
    }
    catch{
        res.send ("Wrong details")
    }
})

router.get('/signup', (req, res)=>{
    res.render('layouts/signup')
})

router.post('/signup', async(req, res) =>{
    const data={
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    }

    const user = movieModel.user

    await user.insertMany([data])

    // res.render('movie/list')
    res.json("welcome")
})



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

router.get('/list', async (req, res) => {
    try {
      const results = await Movie.find({}); // Execute the query and wait for the results
      res.render('movie/list', {data:results}); // Send the results to list.hbs
    } catch (err) {
      console.log('Error:' + err); // Handle any errors
    }
});

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

const insertData = async() => {
    try{
        const docs = await Movie.insertMany(scrapedMovies)
        return Promise.resolve(docs);
    }catch(err){
        return Promise.reject(err);
    }
}

insertData()

module.exports = router