import 'dotenv/config';
import app from './app.js';
import connectDB from './config/db.js';

const PORT = process.env.PORT || 3000;
const HOST_NAME = process.env.HOST_NAME || 'localhost';

const start = async () => {
    try {
        await connectDB();
        app.listen(PORT, HOST_NAME, () => {
            console.log(`Server online with PORT:${PORT} - HOST NAME:${HOST_NAME}`);
        });
    } catch (error) {
        console.error('>>> Error Connect to DB:', error.message);
        process.exit(1);
    }
};

start();
