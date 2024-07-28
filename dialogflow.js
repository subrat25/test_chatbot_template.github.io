const dialogflow = require('@google-cloud/dialogflow').v2beta1;
const { v4: uuidv4 } = require('uuid');
const bots = require('./config/botsConfig');
const Conversation = require('./models/conversation'); 

async function initializeDialogflow(botId) {
    const selectedBot = bots.find(bot => bot.id == botId);
    if (!selectedBot || selectedBot.type !== 'dialogflow') {
        throw new Error('Invalid or unsupported bot ID');
    }

    const credentialsPath = selectedBot.google_application_credentials;
    process.env.GOOGLE_APPLICATION_CREDENTIALS = credentialsPath;
    const sessionClient = new dialogflow.SessionsClient();
    const sessionPath = sessionClient.projectAgentSessionPath(selectedBot.project_id, uuidv4());

    return { sessionClient, sessionPath, selectedBot };
}

async function sendMessageToDialogflow(message, sessionClient, sessionPath) {
    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: message,
                languageCode: 'en-US',
            },
        },
    };

    const [response] = await sessionClient.detectIntent(request);
    return response.queryResult.fulfillmentText;
}

async function createConversationDialogflow(req, res) {
    const botId = req.header('bot_id');
    try {
        const { sessionClient, sessionPath, selectedBot } = await initializeDialogflow(botId);
        const { message, username } = req.body;
        const response = await sendMessageToDialogflow(message, sessionClient, sessionPath);
        
        await Conversation.create({
            sessionId: sessionPath,
            botId: selectedBot.id,
            agentSource: 'dialogflow',
            username: username || null,
            inputText: message,
            outputText: response,
            contextVariables: {},
            timeOfMessage: new Date()
        });

        res.json({ response });
    } catch (error) {
        console.error('Error in createConversationDialogflow:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = {
    createConversationDialogflow,
};
