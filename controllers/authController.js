const prisma = require("../prisma/client");
const bcrypt = require('bcrypt');

//Logs in a user
exports.login = async(req,res)=>{
    try {
        const {email, password} = req.body

        //checks if user exists
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

        //if user does not exist, return error
        if(!user) {
            return res.render("./auth/login",{
                error:"Incorrect email or password"
            })
        }

        //checks if password is correct
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.render("./auth/login",{
                error:"Incorrect email or password"
            })
        }

        // Stores user in session (excluding password)
        req.session.user = {
            id: user.id,
            email: user.email,
            userName: user.userName
        };
        //redirects to home page
        res.redirect("/home")

    } catch (error) {
        //If error, logs it and shows error page
        console.error("Error logging in", error)
        res.status(500).render("error", {error: "Failed to login"})
    }
}

//Signs up a user
exports.signup = async(req,res) =>{
    try {
        const {email, userName, password} = req.body
        
        // Checks if email already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.render("./auth/signup", {
                error: "Email already in use"
            });
        }
        
        // Hashes password before storing
        const hashedPassword = await bcrypt.hash(password, 10);
        
        //Creates a new user
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
        
        //If user isn't created, shows error page
        if(!user){
            return res.render("./auth/signup",{
                error: "Failed to sign up"
            })
        }
        
        // Stores user in session
        req.session.user = user;

        //redirects to home page
        res.redirect("/home")

    } catch (error) {
        //If error, logs it and show error page
        console.error("Error signing up", error)
        res.status(500).render("./auth/signup",{error: "Failed to sign up"})
    }
}

//Logs out a user
exports.logout = async(req,res) => {
    //destroys the session
    try {
        req.session.destroy((err) => {
            if(err) {
                //If error, logs it and shows error page
                return res.status(500).render("error",{error: "Failed to logout"})
            }
            //redirects to home page
            res.redirect("/")
        });
    } catch (error) {
        //If error, logs it and shows error page
        console.error("Error logging out", error)
        res.status(500).render("error",{error: "Failed to logout"})
    }
}

//Checks if user is authenticated
exports.requireAuth = (req,res,next)=>{
    try {
        //If user isn't authenticated, redirects to welcome page
        if(!req.session.user)
            return res.redirect("/")
        next();
        
    } catch (error) {
        //If error, logs it and shows error page
        console.error("Error requiring authentication", error)
        res.status(500).render("error",{error: "Failed to require authentication"})
    }
}