const express=require("express");
const app=express();
const cors=require("cors")
const jwt=require("jsonwebtoken");

users=[];
JWT_SECRET="Shithousery1*";

app.use(cors());
app.use(express.json());



app.get("/", (req, res)=>{
    res.sendFile(__dirname+"/public/index.html")
})

function auth(req, res, next){
    const token=req.headers.authorization; 
    if (token){
        jwt.verify(token, JWT_SECRET, (err, decoded)=>{
            if (err){
                res.status(401).send({
                    msg: "Unauthorized"
                })
            }else{
                req.username=decoded.username;
                next();
            }
        })
    }else{
        res.status(401).send({
            msg:"Unauthorized"
        })
    }
}

app.post( "/signup", (req, res)=>{
    username=req.body.username;
    password=req.body.password;

    users.push({
        username: username,
        password:password
    })

    res.json({
        msg:"You are signed Up"
    })
})

app.post( "/signin", (req, res)=>{
    username= req.body.username;
    password= req.body.password;

    const user=users.find(user=>user.username===username && user.password===password)
    if (user){
        const token=jwt.sign({
            username: user.username
        }, JWT_SECRET);
        user.token=token;
        res.send({
            token: user.token
        })
    }else{
        res.status(403).send({
            msg:"Invalid Credentials"
        })
    }
})

app.get( "/me", auth, (req, res)=>{
    const username=req.username;
    const user=users.find(user=>user.username===username);

    if (user){
        res.send({
            username: user.username,
            password: user.password
        })
    }else{
        res.status(401).send({
            msg:"Unauthorized Access"
        })
    }
})

app.listen(3000)