const express =  require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const app =  express();
const port = 3000;
const axios = require('axios');
const dotenv = require('dotenv').config();

const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

const upload = multer();

let urlencodedParser =  bodyParser.urlencoded({extended: false});

////////////////////////////
///     DATA
////////////////////////////
let moviesList  = [
    {title :  'le fabuleux destin d\'Amelie Poulin',  year : 2001 },
    {title : 'Buffet froid ', year :  1979 },
    {title : 'Le diner des cons', year: 1998 },
    {title : 'De rouille et d\'os', year:  2012}
];


const fakeUser = { email: 'toto@gmail.com', password: 'tata'};
const secret =  "qsdjS12ozehdoIJ123DJOZJLDSCqsdeffdg123ER56SDFZedhWXojqshduzaohduihqsDAqsdq";


/////////////////////////
/// set path to views
/////////////////////////
app.set('views', './views');
app.set('view engine', 'ejs');


//////////////////////////////////
// gestion du repertoire public
/////////////////////////////////
app.use('/public', express.static('public'));

app.use(expressJwt({secret :  secret}).unless({path : ['/', '/movies', '/movie-search','/login']}));

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
})
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