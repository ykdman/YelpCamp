const mongoose = require('mongoose');
mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp")
    .then(success => {
        console.log("Connected MongoDB");
    })
    .catch(err=>{
        console.error(err);
    })