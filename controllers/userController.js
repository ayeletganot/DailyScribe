const prisma = require("../prisma/client");
const bcrypt = require('bcrypt');

exports.getProfile = async (req, res) => {
    try {
        const {user} = req.session
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
        if(!userProfile){
            return res.render("notFound")
        }

        res.render('profile', { userProfile });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).render('error', { error: 'Failed to fetch profile' });
    }
};

exports.getUserComments = async (req, res) => {
    try {
        const {user} = req.session
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

        res.render('userComments', { comments });
    } catch (error) {
        console.error('Error fetching user comments:', error);
        res.status(500).render('error', { error: 'Failed to fetch comments' });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const {user} = req.session
        const { userName, email, currentPassword, newPassword } = req.body;
        const userData = await prisma.user.findUnique({ where: { id: user.id } });
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
            if (existingUser) {
                return res.render('profile', { 
                    userProfile: userData,
                    error: 'Email is already taken' 
                });
            }
        }

        if (currentPassword && newPassword) {
            // update password
            const isValid = await bcrypt.compare(currentPassword, userData.password);
            if (!isValid) {
                return res.render('profile', { 
                    userProfile: userData,
                    error: 'Current password is incorrect' 
                });
            }
            const hashedPassword = await bcrypt.hash(newPassword, 10);
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

        res.render('profile', { 
            userProfile: updatedProfile,
            success: 'Profile updated successfully'
        });
        
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).render('error', { error: 'Failed to update profile' });
    }
};

exports.getUserPosts = async (req, res) => {
    try {
        const {user} = req.session
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
        res.render('userPosts', { posts });

    } catch (error) {
        console.error('Error fetching user posts:', error);
        res.status(500).render('error', { error: 'Failed to fetch posts' });
    }
}; 