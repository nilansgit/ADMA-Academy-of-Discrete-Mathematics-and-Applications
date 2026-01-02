import  bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { loginUser } from "../models/auth.models.js";



export const loginUserController = async (req,res) => {
    const{email, password} = req.body;

    const [result] = await loginUser(email);

    if(!result.length) {
        return res.status(401).json({error: "INVALID EMAIL"})
    }

    const user = result[0];

    const valid = await bcrypt.compare(password, user.password);

    if(!valid) {
        return res.status(401).json({error: "Invalid Password"});
    }

    const token = jwt.sign(
        {userId: user.id, role: user.role},
        process.env.JWT_SECRET,
        {expiresIn: "8h"}
    );

    res.json({
        token,
        role: user.role
    });
}