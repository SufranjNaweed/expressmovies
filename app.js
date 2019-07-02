const express =  require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const app =  express();
const port = 9000;
const axios = require('axios');
const dotenv = require('dotenv').config();
const config = require('./config');

const upload = multer();

let urlencodedParser =  bodyParser.urlencoded({extended: false});

const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

const faker =  require('faker');


//////////////////////////////////
///         MONGODB
//////////////////////////////////
const mongoose = require('mongoose');
mongoose.connect(`mongodb+srv://${config.db.user}:${config.db.password}${dotenv.parsed.MONGODB_CONNECT}/expressmovie?retryWrites=true&w=majority`, {useNewUrlParser: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error : cannot connect to my DB'));
db.once('open', ()=>{
    console.log('connected to the db :) ');
});

const movieSchema = mongoose.Schema({
    movietitle: String,
    movieyear: Number,
    moviedescription:  String,
});

const Movie = mongoose.model('movies', movieSchema);
const title = faker.lorem.sentence(3);
const year  = Math.floor(Math.random() *70) + 1950;

const myMovie = new Movie({
    movietitle: title,
    movieyear: year
});


////////////////////////////
///     DATA
////////////////////////////
let moviesList  = [];

const fakeUser = { email: 'toto@gmail.com', password: 'tata'};
const secret =  "qsdjS12ozehdoIJ123DJOZJLDSCqsdeffdg123ER56SDFZedhWXojqshduzaohduihqsDAqsdq";

/////////////////////////
/// set path to views
/////////////////////////
app.set('views', './views');
app.set('view engine', 'ejs');

////////////////////////////////////
// gestion du repertoire public
///////////////////////////////////
app.use('/public', express.static('public'));

// app.use(expressJwt({secret :  secret}).unless({path : ['/', '/movies', '/movie-search','/login', new RegExp('/movies.*/', 'i')]}));

//////////////////////
//     ROUTES
//////////////////////

///////////
// GET  //
//////////

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/member-only', (req, res) => {
    console.log('req.user', req.user);
    res.send(req.user);
});

app.get('/login', (req, res) =>{
    const title = 'Espace membre';
    res.render('login', {title: title});
});

app.get('/movies', (req, res) => {
    const title = 'Film français des 30 dernière années';
    moviesList = [];
    ////  GET DATA FROM MONGODB
    Movie.find((err, movies)=> {
        if (err){
            console.error(err);
        }
        else{
            console.log(movies);
            moviesList =  movies;
            res.render('movies', { movies :  moviesList, title: title });
        }
    });
});

app.get('/movie-search', (req, res) => {
    const title =  'Rechercher un film';
    res.render('movie-search', {title : title, api_key: dotenv.parsed.API_KEY, api_url: dotenv.parsed.API_URL});
});

app.get('/movie-details', (req, res) =>{
    res.render('movie-details');
});

app.get('/movies/add', (req, res) => {
    res.send('prochainement, un formulaire d\'ajout ici');
});

app.get('/movies/:id', (req, res) =>{
    const  id =  req.params.id;
    res.render('movie-details', {movieId :  id});
});

////////////////
// POST
///////////////

app.post('/login', urlencodedParser, (req, res) => {
    if(!req.body){
        res.sendStatus(500);
    }
    else{
        if (fakeUser.email === req.body.email &&  fakeUser.password === req.body.password) {
            console.log("recognized user");
            const myToken =  jwt.sign({iss: 'http://expressmovies.com', user:'Sam', role: 'moderator'}, secret);
            console.log(myToken);
            res.json(myToken);
        }
        else{
            res.sendStatus(403);
        }
    }
});

app.post('/movies', upload.fields([]), (req, res) => {
    if(!req.body){
        return res.sendStatus(500);
    }
    else {
        const formData =  req.body;
        console.log('formData :  ', formData);
        const title = req.body.movietitle;
        const year  = req.body.movieyear;


        /// SEND DATA TO MONGODB
        const newMovie = { title: title, year: year};
        moviesList   = [...moviesList, newMovie];
        
        const myMovie = new Movie({
            movietitle  : title,
            movieyear   : year
        });
        myMovie.save((err, savedMovie) => {
            if (err){
                console.log(err);
            }
            else{
                console.log(savedMovie);
                res.sendStatus(200);
            }
        });
    }
});


////////////////
// Put
///////////////
/// 5d18d7daa2c1311e7451989d

app.put('/movies/:id', urlencodedParser, (req, res) => {
    if (!req.body){
        return (res.sendStatus(500));
    }
    console.log(req.body)
    console.log('movietitle' ,  req.body.movietitle, 'movieyear : ' , req.body.movieyear);
    const id = req.params.id;

    Movie.findByIdAndUpdate(id, {$set: { movietitle : req.body.movietitle, movieyear: req.body.movieyear}},
        {new : true}, 
        (err, movie) => {
            if (err){
                console.error(err);
                res.send('le film n\'a pas pu etre mis à jours');
            }
        });
     
       //res.send('Put : ' + req.body);
});

/*
app.put('/movies/:id', (req, res)=>{
    console.log(req.params.id);
    console.log(req.body);
    if (!req.body){
        res.send('cest vide ');
    }
    else{
        res.send(req.body.movietitle);
    }
})
*/
///////////////////////////////////////
///     Listen Port a mettre
//      à la fin du point d'entrée
//////////////////////////////////////
app.listen(port, () =>{
    console.log(`listening on port ${port}`);
});