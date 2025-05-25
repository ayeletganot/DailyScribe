const express = require("express")
const router = express.Router()
const prisma = require("../prisma/client")
const { login, signup, logout } = require("../controllers/authController")
const { requireAuth } = require("../controllers/authController")
const { getAllPosts } = require("../controllers/postController")

router.get('/' , (req, res) => {
    return res.render("welcome")
})

router.get("/login",(req,res) =>{
    res.render("./auth/login")
})

router.post("/login", login)

router.get("/signUp",(req,res) =>{
    res.render("./auth/signup")
})

router.post("/signUp",signup)
router.get("/logout",logout)

// Show homepage with user's name
router.get("/home", requireAuth , getAllPosts)



module.exports = router