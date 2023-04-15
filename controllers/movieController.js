const express = require("express");
const router = express.Router();
const mongoose = require("mongoose")
const Movie = mongoose.model("Movieslist")
const User = mongoose.model("users")
const movieController = require("../controllers/movieController")
const scrapedMovies = require("../config/allMovies.json")

router.get('/home', (req, res) =>{
    res.render('layouts/mainlayout')
})

router.get('/login', (req, res)=>{
    res.render('layouts/login')
})

router.post('/login', async(req, res) =>{
    try{
        const check= await User.findOne({name:req.body.name})

        if (check.password === req.body.password){
            res.render("movie/list")
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

    await User.insertMany([data])

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

router.get('/:id', (req, res) =>{
    Movie.findById(req.params.id)
        .then((doc) =>{
            res.render('movie/addoredit', {
                viewTitle: "Edit a movie",
                movie: doc
            })
        })
        .catch((err) =>{
            console.log(err)
        })
})

router.get('/:id', async(req, res) => {
    try{
        const doc = await Movie.findById(req.params.id).exec();
        if(!doc){
            console.log("Document not found")
        }
        return res.render('movie/addorEdit', {viewTitle: "Edit a movie", movie: doc})
    }catch(err){
        console.log(err)
    }
})


router.get('/list',paginatedResults(Movie), async (req, res) => {
    try {
      const results = await Movie.find({}); // Execute the query and wait for the results
      res.render('movie/list', {data:results}); // Send the results to list.hbs
    } catch (err) {
      console.log('Error:' + err); // Handle any errors
    }
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

// function paginatedResults(model){
//     return async (req, res, next) => {
//         const page = parseInt(req.query.page)
//         const limit = parseInt(req.query.limit)

//         const startIndex = (page - 1) * limit
//         const endIndex = page * limit
//         const results = {}

//         if (endIndex < await model.countDocuments().exec()){
//             results.next = {
//                 page: page + 1,
//                 limit : limit
//             }
//         }

//         if (startIndex > 0){
//             results.previous = {
//                 page: page - 1,
//                 limit : limit
//             }
//         }

//         try{
//             results.results = await model.find().limit(limit).skip(startIndex).exec()
//             res.paginatedResults = results
//             next()
//         }catch(err){
//             res.status(500).json({message : err.message})
//         }
//     }
// }

// const insertData = async() => {
//     try{
//         const docs = await Movie.insertMany(scrapedMovies)
//         return Promise.resolve(docs);
//     }catch(err){
//         return Promise.reject(err);
//     }
// }

// insertData()
//     .then((docs) => console.log(docs))
//     .catch((err) => console.log(err));

module.exports = router