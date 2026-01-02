import jwt from "jsonwebtoken";

export const authenticate = (req,res,next) => {
    const header = req.headers.authorization;
    if(!header) { 
        return res.status(401).json({error: "NO TOKEN FOUND"});
    }

    const token = header

    try{
        const payload = jwt.verify(token,process.env.JWT_SECRET);
        req.user = payload;
        console.log(payload)
        next();
    }catch(err){
        res.status(401).json({error: "Invalid token"});
    }
}