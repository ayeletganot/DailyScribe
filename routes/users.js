const express = require("express")
const router = express.Router()
const { requireAuth } = require("../controllers/authController")
const { getProfile, getUserComments, updateProfile, getUserPosts } = require("../controllers/userController")

// Gets user profile
router.get("/profile", requireAuth, getProfile)

// Gets user comments history
router.get("/comments", requireAuth, getUserComments)

// Updates user profile
router.put("/profile", requireAuth, updateProfile)

// Gets user posts
router.get("/posts", requireAuth, getUserPosts)

module.exports = router