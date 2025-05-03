const express = require('express')
const app = express()
const port = 3000

const postsRouter = require("./routes/posts");
const usersRouter = require("./routes/users");
const homeRouter = require("./routes/home");
const {posts} = require("./data");

app.use(express.urlencoded({extended:true}))
app.use(express.static('public'))

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    console.log('Hello World!!')
    if(app.locals.userName){
        app.locals.posts = posts
        return res.render("home")
    }
        
    res.render("welcome")
})

app.post("/set-name",(req,res)=>{
    app.locals.userName = req.body.userName
    res.redirect("/home")
})

// Show homepage with user's name
app.get("/home", (req, res) => {
    const userName = app.locals.userName;
    if (!userName) 
        return res.redirect("/");
    app.locals.posts = posts
    res.render("home");
});
  
app.use("/users",usersRouter)
app.use("/posts",postsRouter)


app.listen(port)