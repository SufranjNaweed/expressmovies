const express =  require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const app =  express();
const port = 3000;
const axios = require('axios');
const dotenv = require('dotenv').config();

const upload = multer();


////////////////////////////
///     DATA
////////////////////////////
let moviesList  = [
    {title :  'le fabuleux destin d\'Amelie Poulin',  year : 2001 },
    {title : 'Buffet froid ', year :  1979 },
    {title : 'Le diner des cons', year: 1998 },
    {title : 'De rouille et d\'os', year:  2012}
];

/////////////////////////
/// set path to views
/////////////////////////
app.set('views', './views');
app.set('view engine', 'ejs');


//////////////////////////////////
// gestion du repertoire public
/////////////////////////////////
app.use('/public', express.static('public'));

//////////////////////
//     ROUTES
//////////////////////

//////////
// GET
/////////
app.get('/', (req, res) => {
    res.render('index');
});
app.get('/movies', (req, res) => {
    const title = 'Film français des 30 dernière années';
    res.render('movies', { movies :  moviesList, title: title });
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

//////////
// POST
/////////

app.post('/movies', upload.fields([]), (req, res) => {
    if(!req.body){
        return res.sendStatus(500);
    }
    else {
        const formData =  req.body;
        console.log('formData :  ', formData);
        const newMovie = { title: req.body.movietitle, year: req.body.movieyear};
        moviesList   = [...moviesList, newMovie];

        res.sendStatus(201);
    }
});



///////////////////////////////////////
///     Listen Port a mettre
//      à la fin du point d'entrée
//////////////////////////////////////
app.listen(port, () =>{
    console.log(`listening on port ${port}`);
});