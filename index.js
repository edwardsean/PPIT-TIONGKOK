import express from 'express';
import bodyParser from 'body-parser';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import pg from "pg";
import loginRoute from './route/loginRoute.js'; 
import uploadEventRoute from './route/uploadEventRoute.js'; // Assuming you have this route

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;


const db = new pg.Pool({
    connectionString: process.env.SUPABASE_DB_URL,
    ssl: { rejectUnauthorized: false }
  });

db.connect();
export {db}

app.use(express.json());
app.use("/login", loginRoute);
app.use("/upload-event-image", uploadEventRoute);
app.use('/static', express.static(join(__dirname, 'static')));


app.get("/", (req, res) => {
    res.sendFile(join(__dirname, "/templates/mainpage.html"))
});

app.get("/mainpage", (req, res) => {
    res.sendFile(join(__dirname, "/templates/mainpage.html"))
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});