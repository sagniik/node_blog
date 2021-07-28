const express = require('express');
const { result } = require('lodash');
const  mongoose  = require('mongoose');
const morgan = require('morgan');
const Blog = require('./models/blog');

//express app
const app = express();

const dbURI = 'mongodb+srv://illusion:1wdAwALJci1tDXw0@cluster0.xytld.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology:true})
.then((result) => app.listen(3000))
.catch((err)=> console.log(err));


//register view engine
app.set('view engine', 'ejs');


// middleware and static files
app.use(express.static('public'));
app.use(morgan('dev'));

//mongoose sandbox routes
app.get('/add-blog', (req, res) =>{
    const blog = new Blog({
        title: 'new blog 2',
        snippet: 'about my new blog',
        body: 'more sbout my blog'
    });
    
    blog.save()
    .then((result) => {
        res.send(result)
    })
    .catch((err) => {
        console.log(err);
    });
});

app.get('/all-blogs', (req, res)=> {
    Blog.find()
    .then((result) => {
        res.send(result);
    })
    .catch((err) => {
     console.log(err);
    });
});

app.get('/', (req, res) => {
    const blogs = [
        {title: 'yoshi is a boy', snippet: 'lalalalalalalalalalalalalalala'},
        {title: 'mario is a boy', snippet: 'lalalalalalalalalalalalalalala'},
        {title: 'ranger is a boy', snippet: 'lalalalalalalalalalalalalalala'},
    ];
    
    // res.send('<p> Home page</p>'); 
    res.render('index', { titles: 'Home', blogs });

});

app.get('/about', (req, res) => {
    
    res.render('about', { titles: 'About' });

});

app.get('/blogs/create', (req, res) => {
    res.render('create', { titles: 'Create a new blog' });
});

//404 page
app.use((req, res) => {
    res.status(404).render('404', { titles: '404' });

});