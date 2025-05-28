const prisma = require("../prisma/client");
const bcrypt = require('bcrypt');
 
//Gets the profile data of the user
exports.getProfile = async (req, res) => {
    try {
        const {user} = req.session

        //Searches for the user's profile data, limiting the user's comments and posts to 3.
        const userProfile = await prisma.user.findUnique({
            where: { id: user.id },
            include: {
                posts: {
                    take: 3,
                    orderBy: { createdAt: 'desc' },
                    include: {
                        author: {
                            select: {
                                userName: true
                            }
                        }
                    }
                },
                comments: {
                    take: 3,
                    orderBy: { createdAt: 'desc' },
                    include: {
                        post: {
                            select: {
                                id: true,
                                title: true
                            }
                        },
                        author: {
                            select: {
                                userName: true
                            }
                        }
                    }
                }
            }
        });

        //If user profile isn't found, shows not found page.
        if(!userProfile){
            return res.render("notFound")
        }
        //Renders the profile page with the user's profile data.
        res.render('profile', { userProfile });

    } catch (error) {
        //If error, logs it and shows error page.
        console.error('Error fetching profile:', error);
        res.status(500).render('error', { error: 'Failed to fetch profile' });
    }
};

//Gets the user's comments.
exports.getUserComments = async (req, res) => {
    try {
        const {user} = req.session

        //Searches for the user's comments.
        const comments = await prisma.comment.findMany({
            where: { authorId: user.id },
            orderBy: { createdAt: 'desc' },
            include: {
                post: {
                    select: {
                        id: true,
                        title: true
                    }
                },
                author: {
                    select: {
                        userName: true
                    }
                }
            }
        });

        //Renders the user comments page with the user's comments.
        res.render('./comment/userComments', { comments });

    } catch (error) {
        //If error, logs it and shows error page.
        console.error('Error fetching user comments:', error);
        res.status(500).render('error', { error: 'Failed to fetch comments' });
    }
};

//Updates the user's profile data.
exports.updateProfile = async (req, res) => {
    try {
        const {user} = req.session
        const { userName, email, currentPassword, newPassword } = req.body;

        //Searches for the user's data.
        const userData = await prisma.user.findUnique({ where: { id: user.id } });
        
        //If user data isn't found, shows error
        if(!userData){
            return res.render('profile', { 
                userProfile: userData,
                error: 'User not found' 
            });
        }

        // Check if email is already taken by another user
        if (email !== userData.email) {
            const existingUser = await prisma.user.findUnique({
                where: { email }
            });
            //If email is already taken, shows error
            if (existingUser) {
                return res.render('profile', { 
                    userProfile: userData,
                    error: 'Email is already taken' 
                });
            }
        }

        //If current password and new password are provided, updates the password.
        if (currentPassword && newPassword) {

            const isValid = await bcrypt.compare(currentPassword, userData.password);
            if (!isValid) {
                //If current password is incorrect, shows error
                return res.render('profile', { 
                    userProfile: userData,
                    error: 'Current password is incorrect' 
                });
            }
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            //Updates the user's profile data.
            await prisma.user.update({
                where: { id: user.id },
                data: { 
                    userName,
                    email,
                    password: hashedPassword
                }
            });
        } else {
            //update username and email
            await prisma.user.update({
                where: { id: user.id },
                data: { userName, email }
            });
        }

        // Update session data
        req.session.user = {
            ...req.session.user,
            userName,
            email
        };

        //Searches for the user's profile data.
        const updatedProfile = await prisma.user.findUnique({
            where: { id: user.id },
            include: {
                posts: {
                    take: 3,
                    orderBy: { createdAt: 'desc' },
                    include: {
                        author: {
                            select: {
                                userName: true
                            }
                        }
                    }
                },
                comments: {
                    take: 3,
                    orderBy: { createdAt: 'desc' },
                    include: {
                        post: {
                            select: {
                                id: true,
                                title: true
                            }
                        },
                        author: {
                            select: {
                                userName: true
                            }
                        }
                    }
                }
            }
        });

        //Renders the profile page with the user's profile data.
        res.render('profile', { 
            userProfile: updatedProfile,
            success: 'Profile updated successfully'
        });
        
    } catch (error) {
        //If error, logs it and shows error page.
        console.error('Error updating profile:', error);
        res.status(500).render('error', { error: 'Failed to update profile' });
    }
};

//Gets the user's posts.
exports.getUserPosts = async (req, res) => {
    try {
        const {user} = req.session

        //Searches for the user's posts.
        const posts = await prisma.post.findMany({
            where: { authorId: user.id },
            orderBy: { createdAt: 'desc' },
            include: {
                author: {
                    select: {
                        userName: true
                    }
                },
                comments: true
            }
        });

        //Renders the user posts page with the user's posts.
        res.render('./post/userPosts', { posts });

    } catch (error) {
        //If error, logs it and shows error page.
        console.error('Error fetching user posts:', error);
        res.status(500).render('error', { error: 'Failed to fetch posts' });
    }
}; 