const express = require("express")
const router = express.Router()
const { login, signup, logout } = require("../controllers/authController")
const { requireAuth } = require("../controllers/authController")
const { getAllPosts } = require("../controllers/postController")

// Shows welcome page
router.get('/' , (req, res) => {
    return res.render("welcome")
})

// Shows login page
router.get("/login",(req,res) =>{
    res.render("./auth/login")
})

// Shows signup page
router.get("/signUp",(req,res) =>{
    res.render("./auth/signup")
})

// Logs in user
router.post("/login", login)

// Signs up user
router.post("/signUp",signup)

// Logs out user
router.get("/logout",logout)

// Shows homepage with user's name
router.get("/home", requireAuth , getAllPosts)

// Shows about page
router.get("/about",(req,res) =>{
    res.render("./about")
})

// Shows contact page
router.get("/contact",(req,res) =>{
    res.render("./contact")
})

module.exports = router