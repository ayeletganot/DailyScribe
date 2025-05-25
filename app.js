const express = require('express')
const app = express()
const port = process.env.port || 3000
const session = require('express-session')

const postsRouter = require("./routes/posts");
const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");

const methodOverride = require('method-override');

//A middleware that allows us to parse the body of the request
app.use(express.urlencoded({extended:true}))
//A middleware that allows us to use PUT and DELETE methods
app.use(methodOverride('_method'))
//A middleware that allows us to use static files
app.use(express.static('public'))

// Session configuration
app.use(session({
    secret: 'your-secret-key', // Change this to a secure secret in production
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' }
}))

//A middleware that makes user available to all views
app.use((req, res, next) => {
    res.locals.user = req.session.user || null
    next()
})

//A middleware that sets the view engine to ejs
app.set('view engine', 'ejs')

//A middleware that uses the authRouter
app.use("/",authRouter)
//A middleware that uses the usersRouter
app.use("/users",usersRouter)
//A middleware that uses the postsRouter
app.use("/posts",postsRouter)

app.listen(port)