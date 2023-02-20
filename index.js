require('dotenv').config()
// Download the helper library from https://www.twilio.com/docs/node/install
// Set environment variables for your credentials
// Read more at http://twil.io/secure
const accountSid = "AC49283af3c987fdeae39db142e744e973";
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

client.messages
  .create({ body: "Ponte", from: "+18557821990", to: "+13056107913" })
  .then(message => console.log(message.sid));