const AssistantV2 = require('ibm-watson/assistant/v2');
const { IamAuthenticator } = require('ibm-watson/auth');
const bots = require('./config/botsConfig');
const Conversation = require('./models/conversation'); // Import the Conversation model

let assistant;
let session_id;

const selectedBot = bots.find(bot => bot.id === 1); // Adjust this as needed

if (selectedBot && selectedBot.type === 'watson') {
    process.env.watson_api_key = selectedBot.watson_api_key;
    process.env.watson_assistant_id = selectedBot.watson_assistant_id;
    process.env.watson_service_url = selectedBot.watson_service_url;
    process.env.watson_version = selectedBot.watson_version;

    const api_key = process.env.watson_api_key;
    const assistant_id = process.env.watson_assistant_id;
    const service_url = process.env.watson_service_url;
    const version = process.env.watson_version;

    const authenticator = new IamAuthenticator({ apikey: api_key });
    assistant = new AssistantV2({
        version: version,
        authenticator: authenticator,
        serviceUrl: service_url,
    });
}

async function createSessionWatson() {
    try {
        const session = await assistant.createSession({ assistantId: process.env.watson_assistant_id });
        session_id = session.result.session_id;
        console.log(`Session ID: ${session_id}`);
        return session_id;
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
async function sendMessage(message, sessionId) {
    try {
        const response = await assistant.message({
            assistantId: process.env.watson_assistant_id,
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
    try {
        const { message, username } = req.body;
        const response = await sendMessage(message, sessionId);
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


module.exports = {
    createConversationWatson,
    createSessionWatson,
};
