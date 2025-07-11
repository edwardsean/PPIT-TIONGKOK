import express from "express";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const router = express.Router();
const __dirname = dirname(fileURLToPath(import.meta.url));


router.get("/", (req, res) => {
    res.sendFile(join(__dirname, "../index.html"));
});

router.post("/verify", (req, res) => {
    const { username, password } = req.body;
    
    const validUsername = process.env.ADMIN_USERNAME;
    const validPassword = process.env.ADMIN_PASSWORD;

    if (username === validUsername && password === validPassword) {
        res.json({ success: true, message: "Login successful" });
    } else {
        res.json({ success: false, message: "Invalid username or password" });
    }
});


export default router;