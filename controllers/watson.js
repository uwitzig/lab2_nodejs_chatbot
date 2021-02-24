const AssistantV2 = require('ibm-watson/assistant/v2');
const { IamAuthenticator } = require('ibm-watson/auth');
const config = require('../config');

const watsonAssistant = new AssistantV2({
    version: config.watson.assistant.version,
    authenticator: new IamAuthenticator({
        apikey: config.watson.assistant.iam_apikey
    }),
    url: config.watson.assistant.url
});

let assistantSessionId = null;

exports.getIndex = (req, res, next) => {
    watsonAssistant.createSession({
        assistantId: config.watson.assistant.assistantId
    })
    .then(result => {
        assistantSessionId = result.result.session_id,
        res.render('index');
    })
    .catch(err => {
        console.log(err);
    })
}

exports.postMessage = (req, res, next) => {
    let text = "";
    if (req.body.input) {
        text = req.body.input.text;
    }
    watsonAssistant.message({
        assistantId: config.watson.assistant.assistantId,
        sessionId: assistantSessionId,
        input: {
            'message_type': 'text',
            'text': text
        }
})
.then(result => {
    console.log(JSON.stringify(result, null, 2));
    res.json(result); // just returns what is received from assistant
})
.catch(err => {
    console.log(err);
})
}