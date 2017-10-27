var express        = require("express"),
    app            = express(),
    mongoose       = require("mongoose"),
    bodyParser     = require("body-parser"),
    moment         = require('moment'),
    methodOverride = require("method-override");

mongoose.connect("mongodb://localhost/restful_blog_app", {useMongoClient: true});  //This creates that db if there isn't one already named that
app.use(express.static("public")); //Allows us to use stylesheet from "public" directory
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));

// MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
    "title": String,
    "image": String,
    "body": String,
    "created": {type: String, default: moment().format('l')}, //Automatically uses current date when user submits posts
    "detailedCreated": {type: Date, default: Date.now}  //Automatically uses current date when user submits posts
});

var Blog = mongoose.model("Blog", blogSchema);


// RESTFUL ROUTES
app.get("/", function(req, res){
    res.redirect("/blogs");
});

// INDEX
app.get("/blogs", function(req, res){
    Blog.find({},function(err, blogs){
        if(err){
            console.log(err);
        } else {
            res.render("index", {blogs:blogs})
        }
    });
});
    
// NEW
app.get("/blogs/new", function(req, res){
  res.render("new"); 
});

// CREATE
app.post("/blogs", function(req, res){
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render("new");
        } else{
            res.redirect("/blogs");
        }
    });
});
    
// SHOW
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            console.log(err)
        } else{
            res.render("show", {blog:foundBlog});         
        }
    });
});

//EDIT
app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs")
        } else {
            res.render("edit", {blog: foundBlog});
        }
    });
});

//UPDATE
app.put("/blogs/:id", function(req, res){
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

//DELETE
app.delete("/blogs/:id", function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err)
        }else{
            res.redirect("/blogs");
            
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log('server has started');
});