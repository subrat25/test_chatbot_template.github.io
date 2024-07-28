require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const { createConversationWatson, createSessionWatson } = require('./watson.js');
const { createConversationDialogflow } = require('./dialogflow.js');
const bots = require('./config/botsConfig.js');
const sequelize = require('./config/database'); // Import sequelize instance

app.use(express.json());

app.get('/watsonchat', (req, res) => {
    res.sendFile(path.join(__dirname, 'UIs', 'watsonchat.html'));
});

app.get('/gdfchat', (req, res) => {
    res.sendFile(path.join(__dirname, "UIs", 'gdfchat.html'));
});

app.get('/api/bot-type', (req, res) => {
    const botId = req.header('bot_id');
    const selectedBot = bots.find(bot => bot.id == botId);

    if (!selectedBot) {
        return res.status(400).json({ error: 'Invalid bot_id' });
    }

    res.json({ bot_type: selectedBot.type });
});

app.post('/api/watson/session', async (req, res) => {
    const botId = req.header('bot_id');
    try {
        const sessionId = await createSessionWatson(botId);
        res.json({ session_id: sessionId });
    } catch (error) {
        res.status(500).json({ error: 'Error creating Watson session' });
    }
});

app.post('/api/message', async (req, res) => {
    const botId = req.header('bot_id');
    const sessionId = req.header('session_id'); 
    const selectedBot = bots.find(bot => bot.id == botId);

    if (!selectedBot) {
        return res.status(400).json({ error: 'Invalid bot_id' });
    }

    switch (selectedBot.type) {
        case 'watson':
            try {
                await createConversationWatson(req, res, sessionId); 
            } catch (error) {
                res.status(500).json({ error: 'Error handling Watson conversation' });
            }
            break;
        case 'dialogflow':
            await createConversationDialogflow(req, res);
            break;
        default:
            res.status(400).json({ error: 'Unsupported bot type' });
    }
});

// Initialize Sequelize and start the server
sequelize.sync()
    .then(() => {
        console.log('Database synchronized');
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Error synchronizing database:', err);
    });
