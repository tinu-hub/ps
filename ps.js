const express = require('express');
const multer = require('multer');
const axios = require('axios');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const filePath = path.join(__dirname, 'uploads', req.file.filename);
        const fileStream = fs.createReadStream(filePath);
        const TELEGRAM_BOT_TOKEN = 'your_bot_token';
        const TELEGRAM_CHAT_ID = 'your_chat_id';
        
        await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendDocument`, {
            chat_id: TELEGRAM_CHAT_ID,
            document: fileStream
        }, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        
        fs.unlinkSync(filePath); // Clean up the file after sending
        res.json({ success: true });
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ success: false });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
