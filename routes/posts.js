const express = require("express")
const router = express.Router()
const {comments} = require("../data")


router.get("/",(req,res)=>{
    // res.render("home",{posts})
})

// Renders the Form to write new post.
router.get("/new",(req,res)=>{
    res.render("addPost")
})

//Gets data from the From and add the post.
router.post("/new",(req,res)=>{
    const {posts,userName} = req.app.locals
    posts.push({
        userName,
        title:req.body.title,
        content: req.body.content
    });
    res.render("home")
})

router.get("/:id",(req,res)=>{
    const postId = req.params.id
    const {posts,userName} = req.app.locals
    const currPost = posts.find((post)=> post.id == postId);
    const currPostComments  = comments.filter((comment)=> comment.postId == postId)
    currPost.comments = currPostComments
    console.log(currPostComments)
    res.render("post",{currPost})

})


module.exports = router