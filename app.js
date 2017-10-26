var express    = require("express"),
    app        = express(),
    mongoose   = require("mongoose"),
    bodyParser = require("body-parser");

mongoose.connect("mongodb://localhost/restful_blog_app", {useMongoClient: true});  //This creates that db if there isn't one already named that
app.use(express.static("public")); //Allows us to use stylesheet from "public" directory
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");

// MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
    "title": String,
    "image": String,
    "body": String,
    "created": {type: Date, default: Date.now}  //Automatically uses current date when user submits posts
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
        }else{
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
        }else{
            res.redirect("/blogs");
        }
    });
});
    
// SHOW

app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            console.log(err)
        }else{
            res.render("show", {blog:foundBlog});         
        }
    });
});
    
app.listen(process.env.PORT, process.env.IP, function(){
    console.log('server has started');
});