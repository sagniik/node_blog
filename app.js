const { render } = require('ejs');
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
app.use(express.urlencoded({extended: true}))
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

// app.get('/single-blog', (req, res) => {
//     Blog.findById('61006206f8d35f62b02db2c7')
//     .then((result) => {
//         res.send(result);
//     })
//     .catch((err) => {
//      console.log(err);
//     });
// });

app.get('/', (req, res) => {
    res.redirect('/blogs');
});

app.get('/about', (req, res) => {
    
    res.render('about', { title: 'About' });

});

//blog routes

app.get('/blogs', (req, res) => {
    Blog.find().sort({ createdAt: -1 })
    .then((result) => {
        res.render('index', { title: 'All Blogs', blogs: result })
    })
    .catch((err) => {
     console.log(err);
    });
})

app.post('/blogs', (req, res) =>{
    const blog = new Blog(req.body);

    blog.save()
    .then((result)=> {
        res.redirect('/blogs');
    })
    .catch((err) => {
        console.log(err);
    });
});

app.get('/blogs/:id', (req, res)=> {
    const id = req.params.id;
    console.log(id);
    Blog.findById(id)
    .then(result => {
        res.render('details', { blog: result, title: 'Blog Details'});
    })
    .catch(err => {
        console.log(err);
    });
})


app.get('/create', (req, res) => {
    res.render('create', { title: 'Create a new blog' });
});

//404 page
app.use((req, res) => {
    res.status(404).render('404', { title: '404' });

});