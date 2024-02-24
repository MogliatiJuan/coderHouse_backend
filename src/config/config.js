export default {
  DB_URL: process.env.DB_URL,
  CLIENTID_GITHUB: process.env.CLIENTID_GITHUB,
  CLIENTSECRET_GITHUB: process.env.CLIENTSECRET_GITHUB,
  CALLBACKURL_GITHUB: process.env.CALLBACKURL_GITHUB,
  JWT_SECRET: process.env.JWT_SECRET,
  PERSISTENCE: process.env.PERSISTENCE || "mongoDB",
  TWILIO: {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    phoneNumber: process.env.TWILIO_SMS_NUMBER,
  },
  ENV: process.env.NODE_ENV || "development",
};
