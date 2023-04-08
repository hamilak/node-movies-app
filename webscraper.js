const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs')
const movieModel = require("../node-movies-app/models/model")
const mongoose = require('mongoose')

const url = "https://www.imdb.com/chart/top/?ref_=nv_mv_250"

const allMovies = []

async function getHTML (){
    const { data : html } = await axios.get(url);
    return html
};

const retrieveData = getHTML().then((res) => {
    const $ = cheerio.load(res);
    $('.lister-list>tr').each((i, movie) => {
        const moviesData = {}
        const name = $(movie).find('.titleColumn a').text();
        const year = Number(($(movie).find('.titleColumn span').text()).replace(/[{()}]/g, ''));
        const rating = Number($(movie).find('.ratingColumn strong').text());
        moviesData["name"] = name;
        moviesData["year"] = year;
        moviesData["rating"] = rating;
        
        allMovies.push(moviesData);
    }
    );
    fs.writeFile('allMovies.json', JSON.stringify(allMovies), (err) =>{
        if (err) throw err;
        console.log('file successfully saved')
    });
});
