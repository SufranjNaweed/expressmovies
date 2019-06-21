const express =  require('express');
const app =  express();
const port = 3000;


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

app.get('/', (req, res) => {
    res.render('index');
});
app.get('/movies', (req, res) => {

    const title = 'Film français des 30 dernière années';
    const frenchMovies  = [
        {title :  'le fabuleux destin d\'Amelie Poulin',  year : 2001 },
        {title : 'Buffet froid ', year :  1979 },
        {title : 'Le diner des cons', year: 1998 },
        {title : 'De rouille et d\'os', year:  2012}
    ];
    res.render('movies', { movies :  frenchMovies, title: title });
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


app.post('/movies', (req, res) => {
    console.log(req.body);
});
///////////////////////////////////////
///     Listen Port a mettre
//      à la fin du point d'entrée
//////////////////////////////////////
app.listen(port, () =>{
    console.log(`listening on port ${port}`);
});