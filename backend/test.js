import bcrypt from "bcrypt";
console.log(await bcrypt.hash("pass", 10));