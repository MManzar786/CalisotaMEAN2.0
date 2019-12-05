const twilioClient = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const fromNumber = process.env.twilio_from_number;

module.exports.sendSms = (toNumber, body) => {
  return new Promise((resolve, reject) => {
    twilioClient.messages
    .create({
      body: body,
      from: fromNumber,
      to: toNumber
    })
    .then(messageRes => {
      if (!messageRes.errorCode) {
        reject(messageRes.errorMessage);
      } else {
        resolve(messageRes);
      }
    });
  });
};

// sample response
/*
  {"accountSid":"ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  "apiVersion":"2010-04-01",
  "body":"This is the ship that made the Kessel Run in fourteen parsecs?",
  "dateCreated":"2018-09-11T17:29:05.000Z",
  "dateUpdated":"2018-09-11T17:29:05.000Z",
  "dateSent":null,"direction":"outbound-api",
  "errorCode":null,
  "errorMessage":null,
  "to":"+15558675310",
  "from":"+15017122661",
  "messagingServiceSid":null,"numMedia":"0",
  "numSegments":"1",
  "price":null,"priceUnit":"USD",
  "sid":"SMXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  "status":"queued",
  "uri":"/2010-04-01/Accounts/ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX7/Messages/SMXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX.json",
  "subresourceUris":{
    "media": null
  }
  }​
*/
