const dialogflow = require('@google-cloud/dialogflow').v2beta1;
const { v4: uuidv4 } = require('uuid');
const bots = require('./config/botsConfig');
const path = require('path');
const Conversation = require('./models/conversation'); // Import the Conversation model

const selectedBot = bots.find(bot => bot.id === 2); // Adjust this as needed

let sessionClient;
let sessionPath;

if (selectedBot && selectedBot.type === 'dialogflow') {
    const credentialsPath = selectedBot.google_application_credentials;
    process.env.GOOGLE_APPLICATION_CREDENTIALS = credentialsPath;
    sessionClient = new dialogflow.SessionsClient();
    sessionPath = sessionClient.projectAgentSessionPath(selectedBot.project_id, uuidv4());
}

async function sendMessageToDialogflow(message) {
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
    try {
        const { message, username } = req.body;
        const response = await sendMessageToDialogflow(message);
        
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
