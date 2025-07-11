import express from 'express';
import bodyParser from 'body-parser';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import loginRoute from './route/loginRoute.js'; 
// import uploadEventRoute from './route/uploadEventRoute.js'; // Assuming you have this route

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;
app.use(express.json());
app.use("/login", loginRoute);
// app.use("upload-event-image", uploadEventRoute);
app.use('/static', express.static(join(__dirname, 'static')));


app.get("/", (req, res) => {
    res.sendFile(join(__dirname, "/templates/mainpage.html"))
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});