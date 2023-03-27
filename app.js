//**Server */

//express
const express = require('express');
const app = express();

//ejs-mate engine
const ejsMate = require('ejs-mate');

//method-override 사용
const method_override = require('method-override');
//morgan 사용 (미들웨어)
const morgan = require('morgan');
app.use(morgan('tiny'));

//mongoose Connect
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
    .then(connect=>{
        console.log("MongoDB : yelp-camp Connected");
    })
    .catch(error=>{
        console.error(error);
    })
//mongoose 6버전 이후부터 newUrlParser와 같은 옵션 선택 안해도되게 변경되었음

//Schema
const Campground = require('./models/campground');


// const db = mongoose.connection;
// db.on("error", console.error.bind(console, "connection Error : "));
// db.once("open", ()=>{
//     console.log("DataBase Connected");
// })


// Utility
const path = require('path');

//app engine Setting
app.engine('ejs',ejsMate);


//view Setting
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'));

// Json 사용
app.use(express.json())
app.use(express.urlencoded({extended : true}));

//Method 사용
app.use(method_override('_method'));


// app.get('/', (req,res) =>{
//     res.render('home');
// })

// app.get('/makecampground', async (req,res) =>{
//     const camp = new Campground({title:'My Backyard',description:'cheap camping!'});
//     await camp.save();
//     res.send(camp);
// })

// home
app.get('/', (req,res)=>{
    res.render('home');
})

// main campground (Read)
app.get('/campgrounds', async (req,res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index',({campgrounds}));
})

// campground Create New (Create)
app.get('/campgrounds/new', (req,res)=>{
    res.render('campgrounds/new');
})

app.post('/campgrounds', async(req,res)=>{
    const {title, location} = req.body.campground; //title, location 생성자 할당
    const newCampground = new Campground({title:title, location : location});
    await newCampground.save();
    console.log("new camp Added!");
    console.log(newCampground);
    res.redirect(`/campgrounds/${newCampground._id}`);
})

// campground index (Read)
app.get('/campgrounds/:id', async (req,res)=>{
    const id = req.params.id;
    //특정한 데이터를 findById로 찾기
    const campground = await Campground.findById(id);
    res.render('campgrounds/show',{campground});
})

// Campground Edit (update)
app.get('/campgrounds/:id/edit', async (req,res)=>{
    //기존 데이터를 갖고와 변경 전 값을 볼수 있어야 한다.
    const id = req.params.id;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', {campground});

})

app.put('/campgrounds/:id', async (req,res)=>{
    const id = req.params.id; //분해 할당인지, 직접 할당인지 제대로 사용해야한다.
    console.log(req.params);
    console.log(id);
    //const {title, location} = req.body.campground;
    const editCampground = await Campground.findByIdAndUpdate(id, {...req.body.campground},{runValidators:true})
    console.log(editCampground);
    res.redirect(`/campgrounds/${editCampground._id}`);
})

// campground Delete (delete)
app.delete('/campgrounds/:id', async(req,res)=>{
    const id = req.params.id;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds')
})

// 서버 리슨
app.listen(3000, () => {
    console.log("Serving On Port 3000");
})