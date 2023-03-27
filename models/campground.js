const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const campgroundeSchema = new Schema({
    title : String, 
    image: String,
    price : Number,
    description : String,
    location : String
});

//Campground 모델 생성
module.exports = mongoose.model('Campground',campgroundeSchema);