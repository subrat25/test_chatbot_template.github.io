const AssistantV2 = require('ibm-watson/assistant/v2');
const { IamAuthenticator } = require('ibm-watson/auth');
const bots = require('./config/botsConfig');
const Conversation = require('./models/conversation'); 

async function createSessionWatson(botId) {
    const selectedBot = bots.find(bot => bot.id == botId);
    if (!selectedBot || selectedBot.type !== 'watson') {
        throw new Error('Invalid or unsupported bot ID');
    }

    const assistant = new AssistantV2({
        version: selectedBot.watson_version,
        authenticator: new IamAuthenticator({ apikey: selectedBot.watson_api_key }),
        serviceUrl: selectedBot.watson_service_url,
    });

    try {
        const session = await assistant.createSession({ assistantId: selectedBot.watson_assistant_id });
        return session.result.session_id;
    } catch (error) {
        console.error('Error creating session:', error);
        throw error;
    }
}

function processResponse(response) {
    let message = "";

    response.forEach(e => {
        if (e.response_type === "text") {
            message += e.text + " ";
        } else if (e.response_type === "option") {
            message += e.title + " ";
            e.options.forEach(opt => {
                message += opt.label + " ";
            });
        }
    });

    return message.trim();
}

async function sendMessage(message, sessionId, botId) {
    const selectedBot = bots.find(bot => bot.id == botId);
    if (!selectedBot || selectedBot.type !== 'watson') {
        throw new Error('Invalid or unsupported bot ID');
    }

    const assistant = new AssistantV2({
        version: selectedBot.watson_version,
        authenticator: new IamAuthenticator({ apikey: selectedBot.watson_api_key }),
        serviceUrl: selectedBot.watson_service_url,
    });

    try {
        const response = await assistant.message({
            assistantId: selectedBot.watson_assistant_id,
            sessionId: sessionId,
            input: {
                'message_type': 'text',
                'text': message
            },
            context: {
                'metadata': {
                    'deployment': 'myDeployment'
                }
            }
        });
        return response.result.output.generic;
    } catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
}

async function createConversationWatson(req, res, sessionId) {
    const botId = req.header('bot_id');
    const selectedBot = bots.find(bot => bot.id == botId);
    if (!selectedBot || selectedBot.type !== 'watson') {
        return res.status(400).json({ error: 'Invalid bot_id' });
    }

    try {
        const { message, username } = req.body;
        const response = await sendMessage(message, sessionId, botId);
        const processedResponse = processResponse(response);

        await Conversation.create({
            sessionId: sessionId,
            botId: selectedBot.id,
            agentSource: 'watson',
            username: username || null,
            inputText: message,
            outputText: processedResponse,
            contextVariables: {},
            timeOfMessage: new Date()
        });

        res.json({ response: processedResponse });
    } catch (error) {
        console.error('Error in createConversationWatson:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = {
    createConversationWatson,
    createSessionWatson,
};
