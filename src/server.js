import 'dotenv/config.js';
import express from 'express';
import connectDB from './config/db.js';
const app = express();
const PORT = process.env.PORT || 3000;
const HOST_NAME = process.env.HOST_NAME || 'localhost';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('j1');
});

(async () => {
    try {
        await connectDB();
        app.listen(PORT, HOST_NAME, () => {
            console.log(`Server online with PORT:${PORT} - HOST NAME:${HOST_NAME}`);
        })
    } catch (error) {
        console.log('>>> Error Connect to DB: ', error);
    }
})();
