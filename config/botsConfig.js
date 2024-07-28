const fs = require('fs');
const path = require('path');

// Load credentials from credentials.json
const credentialsPath = path.join(__dirname, '..', 'creds', 'credentials.json');
const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));

const bots = credentials.map(cred => {
    if (cred.type === 'dialogflow') {
        // For Dialogflow, create a path for the credentials file
        const credsFilePath = path.join(__dirname, `dialogflow-creds-${cred.id}.json`);

        // Check if the file exists
        if (!fs.existsSync(credsFilePath)) {
            // Write the credentials to the file only if it does not exist
            fs.writeFileSync(credsFilePath, JSON.stringify(cred.google_application_credentials));
        }

        return {
            id: cred.id,
            type: cred.type,
            project_id: cred.project_id,
            google_application_credentials: credsFilePath
        };
    }
    return cred;
});


module.exports = bots;
