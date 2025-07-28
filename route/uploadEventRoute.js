import express from 'express';
import multer from "multer";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { db } from "../index.js"; 

const __dirname = dirname(fileURLToPath(import.meta.url));
const router = express.Router();

const uploadDir = join(__dirname, "../static/uploads/events");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = file.originalname.split('.').pop();
        cb(null, `event-${uniqueSuffix}.${ext}`);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 16 * 1024 * 1024 }, 
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const ext = file.originalname.split('.').pop().toLowerCase();
        if (allowedTypes.test(ext)) {
            cb(null, true);
        } else {
            cb(new Error("Only image files are allowed!"));
        }
    }
});

router.post("/", upload.single("eventImage"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    const filename = req.file.filename;
    const url = `/static/uploads/events/${filename}`;
    const uploadedAt = new Date();

    try {
        const insertQuery = `
            INSERT INTO event_images (file_name, url)
            VALUES ($1, $2)
            RETURNING id
        `;
        const result = await db.query(insertQuery, [filename, url]);

        res.json({
            message: "Upload successful",
            imageUrl: url,
            imageId: result.rows[0].id
        });
    } catch (err) {
        console.error("DB insert error:", err);
        res.status(500).json({ error: "Database insert failed" });
    }
});

export default router;