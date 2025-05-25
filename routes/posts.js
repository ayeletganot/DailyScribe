const express = require("express")
const router = express.Router()
const {createPost, getPostPage, createComment, deletePost, deleteComment, editComment} = require("../controllers/postController")
const {requireAuth} = require("../controllers/authController")

// Renders the Form to write new post.
router.get("/new",requireAuth,(req,res)=>{
    res.render("addPost")
})

//Gets post data from the Form and adds the post.
router.post("/new", requireAuth ,createPost)

//Get a post id, and render it's page
router.get("/:id", requireAuth ,getPostPage)

//Gets comment data from the Form and adds it to the accoding post.
router.post("/:id/comment/new",requireAuth ,createComment)

// Delete a post
router.delete("/:id", requireAuth, deletePost)

// Delete a comment
router.delete("/:postId/comment/:commentId", requireAuth, deleteComment)

// Edit a comment
router.put("/:postId/comment/:commentId", requireAuth, editComment)


module.exports = router