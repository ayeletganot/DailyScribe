const express = require("express")
const router = express.Router()
const { requireAuth } = require("../controllers/authController")
const { getProfile, getUserComments, updateProfile, getUserPosts } = require("../controllers/userController")

// Get user profile
router.get("/profile", requireAuth, getProfile)

// Get user comments history
router.get("/comments", requireAuth, getUserComments)

// Update user profile
router.put("/profile", requireAuth, updateProfile)

// User posts routes
router.get("/posts", requireAuth, getUserPosts)

module.exports = router