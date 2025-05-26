const prisma = require("../prisma/client");

exports.getAllPosts = async (req, res) => {
    try {
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
        res.render("home", { posts })
    } catch (error) {
        console.error("Error fetching posts", error)
        res.status(500).render("error", { error: "Failed to fetch posts" })
    }
};

exports.getPostPage = async (req, res) => {
    try {
        const postId = req.params.id
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
        if (!currPost)
            return res.render("notFound")

        res.render("./post/index", { post: currPost })

    } catch (error) {
        console.error("Error fetching post", error)
        res.status(500).render("error", { error: "Failed to fetch post" })
    }
};

exports.createPost = async (req, res) => {
    try {
        const { user } = req.session

        const newPost = {
            title: req.body.title,
            content: req.body.content,
            createdAt: new Date(),
            authorId: user.id
        }
        await prisma.post.create({ data: newPost })
        res.redirect("../home")

    } catch (error) {
        console.error("Error creating post", error)
        res.status(500).render("error", { error: "Failed to create post" })
    }
}

exports.createComment = async (req, res) => {
    try {
        const { content } = req.body;
        const postId = req.params.id;
        const { user } = req.session;

        const newComment = {
            content,
            postId,
            authorId: user?.id
        };

        const comment = await prisma.comment.create({
            data: newComment,
            include: {
                author: {
                    select: {
                        userName: true
                    }
                }
            }
        });
        res.redirect(`/posts/${postId}`);

    } catch (error) {
        console.error('Error creating comment:', error);
        res.status(500).render("error", { error: 'Failed to create comment' });
    }
};

exports.deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const { user } = req.session;

        const post = await prisma.post.findUnique({
            where: { id: postId }
        });

        if (!post || post.authorId !== user.id) {
            return res.render("error", {error: "Not authorized to delete this post", status:403 })
        }

        await prisma.comment.deleteMany({
            where: { postId }
        });

        await prisma.post.delete({
            where: { id: postId }
        });
        res.redirect("home");

    } catch (error) {
        console.error("Error deleteing post", error)
        res.status(500).render("error", { error: "Failed to delete post" })
    }
};

exports.deleteComment = async (req, res) => {
    try {
        const { postId, commentId } = req.params;
        const { user } = req.session;

        const comment = await prisma.comment.findUnique({
            where: { id: commentId }
        });

        if (!comment || comment.authorId !== user.id) {
            return res.render("error", {error: "Not authorized to delete this comment", status:403 })

        }

        await prisma.comment.delete({
            where: { id: commentId }
        });

        res.redirect(`/posts/${postId}`);

    } catch (error) {
        console.error("Error deleteing comment", error)
        res.status(500).render("error", { error: "Failed to delete comment" })
    }
};





