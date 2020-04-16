const express = require("express"); 
const app = express();
const bodyParser = require("body-parser");
const mongodb = require('mongodb');
const expressSanitizer    = require("express-sanitizer");
const methodOverride      = require("method-override");
const db = require("./db");
const ObjectId = mongodb.ObjectId;


app.set("view engine", "ejs"); // Alloy using ejs, without write the complete name
app.use(bodyParser.urlencoded({extended: true})); // it's for gettin the input from the forms
app.use(express.static("public/stylesheets")); // this allow to get the CSS styles inse the folder path
app.use(bodyParser.json());
app.use(expressSanitizer());
app.use(methodOverride("_method"));


const collection = "blogs";


//RESTFULL ROUTES
app.get("/", function(req, res) {
    res.redirect("/blogs");
});


//INDEX ROUTE
app.get("/blogs", function(req, res){
    db.getDB().collection(collection).find({}).toArray((err, blogs) =>{
        if(err){
            console.log("ERROR");
        }else{
            res.render("index", {blogs: blogs});
        }
    });

});

//NEW ROUTE
app.get("/blogs/new", function(req, res) {
    res.render("new");
});

//CREATE ROUTE
app.post("/blogs", function(req, res){
    //create blog
    let title = req.body.title;
    let image = req.body.image;
    let content = req.sanitize(req.body.content);
    let createdat = Date("<YYYY-mm-ddTHH:MM:ss>");
    let newBlog = {title: title, image: image, content: content, createdat: createdat };
    console.log(newBlog);
    console.log("=======================================");
    db.getDB().collection(collection).insertOne(newBlog, function(err, newBlog){
        if(err){
            res.render("new");
        }else{
            //then reditect to blogs
            //console.log(newBlog);
            res.redirect("/blogs");
        }
    });
});


//SHOW ROUTE
app.get("/blogs/:id", function(req, res) {
    const blogID = req.params.id;

    db.getDB().collection(collection).findOne({_id: new ObjectId(blogID)}, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            console.log(foundBlog)
            res.render("show", {blog: foundBlog});
        }
    });
});


//EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res) {
    const blogID = req.params.id;

    db.getDB().collection(collection).findOne({_id: new ObjectId(blogID)}, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("edit", {blog: foundBlog});
        }
    });
});


//UPDATE ROUTE
app.put("/blogs/:id", function(req, res){
    //create blog
    const blogID = req.params.id;
    let title = req.body.title;
    let image = req.body.image;
    let content = req.sanitize(req.body.content);
    let createdat = new Date("<YYYY-mm-ddTHH:MM:ss>");
    let updateBlog = {title: title, image: image, content: content, createdat: createdat };
    
    db.getDB().collection(collection).updateOne({_id: new ObjectId(blogID)}, {$set: updateBlog }, function(err, updateBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

//DELETE ROUTE
app.delete("/blogs/:id", function(req, res){
    const blogID = req.params.id;

    //destroy blog
    db.getDB().collection(collection).deleteOne({_id: new ObjectId(blogID)}, function(err){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs");
        }
    });
    //redirect somewhere
});




/// Establishing the conection of the DB and running the App if everything is OK
db.connect((err) => {
    if(err){
        console.log('unable to connect to database Broh');
        process.exit()
    }else{
    //For the localhost enviroment
/*         app.listen(8080, function() {
            console.log("This server is runing in PORT 8080 Broh!, and the DB is also running")
        }); */ 
    // For the Cloud on Heroku
    app.listen(process.env.PORT, process.env.IP, function(){
        console.log("RichardCamp is open!");
    });    
    }
});