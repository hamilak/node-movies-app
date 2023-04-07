const mongoose = require("mongoose")

mongoose.connect("mongodb://127.0.0.1:27017/Mymoviesapp")
.then(() =>{
    console.log("mongodb connected")
})
.catch(()=>{
    console.log("Failed to connect")
});

require("./model")