const prisma = require("../prisma/client");
const bcrypt = require('bcrypt');

exports.login = async(req,res)=>{
    try {
        const {email, password} = req.body
        console.log(email, password)
        const user = await prisma.user.findUnique({
            where: {
                email
            },
            select:{
                id: true,
                email: true,
                userName: true,
                password: true
            }
        })

        if(!user) {
            return res.render("./auth/login",{
                error:"Incorrect email or password"
            })
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.render("./auth/login",{
                error:"Incorrect email or password"
            })
        }

        // Store user in session (excluding password)
        req.session.user = {
            id: user.id,
            email: user.email,
            userName: user.userName
        };
        
        res.redirect("home")

    } catch (error) {
        console.error("Error logging in", error)
        res.status(500).render("error", {error: "Failed to login"})
    }
}

exports.signup = async(req,res) =>{
    try {
        const {email, userName, password} = req.body
        
        // Check if email already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.render("./auth/signup", {
                error: "Email already in use"
            });
        }
        
        // Hash password before storing
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const user = await prisma.user.create({
            data: {
                email,
                userName,
                password: hashedPassword,
            },
            select: {
                id: true,
                email: true,
                userName: true,
            },
        })
        
        if(!user){
            return res.render("./auth/signup",{
                error: "Failed to sign up"
            })
        }
        
        // Store user in session
        req.session.user = user;
        res.redirect("home")

    } catch (error) {
        console.error("Error signing up", error)
        res.status(500).render("./auth/signup",{error: "Failed to sign up"})
    }
}

exports.logout = async(req,res) => {
    try {
        req.session.destroy((err) => {
            if(err) {
                return res.status(500).render("error",{error: "Failed to logout"})
            }
            res.redirect("/")
        });
    } catch (error) {
        console.error("Error logging out", error)
        res.status(500).render("error",{error: "Failed to logout"})
    }
}

exports.requireAuth = (req,res,next)=>{
    try {
        if(!req.session.user)
            return res.redirect("/")
        next();
        
    } catch (error) {
        console.error("Error requiring authentication", error)
        res.status(500).render("error",{error: "Failed to require authentication"})
    }
}