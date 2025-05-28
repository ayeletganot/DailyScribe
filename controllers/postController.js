const prisma = require("../prisma/client");

//Gets all posts
exports.getAllPosts = async (req, res) => {
    try {
        //Gets all posts
        const posts = await prisma.post.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                author: {
                    select: {
                        userName: true,
                        id: true
                    }
                }
            }
        })
        //Renders the home page with the posts
        res.render("home", { posts })
    } catch (error) {
        //If error, logs it and shows error page
        console.error("Error fetching posts", error)
        res.status(500).render("error", { error: "Failed to fetch posts" })
    }
};

//Gets a post
exports.getPostPage = async (req, res) => {
    try {
        const postId = req.params.id
        //Gets the post data
        const currPost = await prisma.post.findUnique({
            where: { id: postId },
            include: {
                comments: {
                    include: {
                        author: {
                            select: {
                                userName: true,
                                id: true
                            }
                        },
                        post: {
                            select: {
                                id: true,
                                title: true
                            }
                        }
                    }
                },
                author: {
                    select: {
                        userName: true,
                        id: true
                    }
                }
            }
        });
        //If post is not found, shows not found page
        if (!currPost)
            return res.render("notFound")
        //Renders the post page
        res.render("./post/index", { post: currPost })

    } catch (error) {
        //If error, logs it and shows error page
        console.error("Error fetching post", error)
        res.status(500).render("error", { error: "Failed to fetch post" })
    }
};

//Creates a post
exports.createPost = async (req, res) => {
    try {
        const { user } = req.session

        //Creates a new post
        const newPost = {
            title: req.body.title,
            content: req.body.content,
            createdAt: new Date(),
            authorId: user.id
        }
        //Creates the post
        await prisma.post.create({ data: newPost })
        //Redirects to home page
        res.redirect("/home")

    } catch (error) {
        //If error, logs it and shows error page
        console.error("Error creating post", error)
        res.status(500).render("error", { error: "Failed to create post" })
    }
}

//Create a comment
exports.createComment = async (req, res) => {
    try {
        //Gets the comment data
        const { content } = req.body;
        const postId = req.params.id;
        const { user } = req.session;

        //Creates a new comment
        const newComment = {
            content,
            postId,
            authorId: user?.id
        };

        //Creates the comment
        await prisma.comment.create({
            data: newComment,
            include: {
                author: {
                    select: {
                        userName: true
                    }
                }
            }
        });

        //Redirects to the post page
        res.redirect(`/posts/${postId}`);

    } catch (error) {
        //If error, logs it and shows error page
        console.error('Error creating comment:', error);
        res.status(500).render("error", { error: 'Failed to create comment' });
    }
};

//Deletes a post
exports.deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const { user } = req.session;

        //Searches for the post
        const post = await prisma.post.findUnique({
            where: { id: postId }
        });

        //If post is not found or user is not the author, shows error page
        if (!post || post.authorId !== user.id) {
            return res.render("error", {error: "Not authorized to delete this post", status:403 })
        }

        //Deletes all comments associated with the post.
        await prisma.comment.deleteMany({
            where: { postId }
        });

        //Deletes the post
        await prisma.post.delete({
            where: { id: postId }
        });

        //Redirects to home page
        res.redirect("/home");

    } catch (error) {
        //If error, logs it and shows error page
        console.error("Error deleteing post", error)
        res.status(500).render("error", { error: "Failed to delete post" })
    }
};

exports.deleteComment = async (req, res) => {
    try {
        //Gets the comment data
        const { postId, commentId } = req.params;
        const { user } = req.session;

        //Searches for the comment
        const comment = await prisma.comment.findUnique({
            where: { id: commentId }
        });

        //If comment isn't found or user isn't the author, shows error page
        if (!comment || comment.authorId !== user.id) {
            return res.render("error", {error: "Not authorized to delete this comment", status:403 })
        }

        //Deletes the comment
        await prisma.comment.delete({
            where: { id: commentId }
        });

        //Redirects to the post page
        res.redirect(`/posts/${postId}`);

    } catch (error) {
        //If error, logs it and shows error page
        console.error("Error deleteing comment", error)
        res.status(500).render("error", { error: "Failed to delete comment" })
    }
};





