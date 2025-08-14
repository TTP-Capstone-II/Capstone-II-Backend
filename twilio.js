const twilio = require("twilio");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

const generateTurnToken = async (req, res) => {
  try {
    // Create Identity for twilio token
    const identity = req.query.identity || "guest-" + Date.now();

    // Create Twilio Token
    const token = new twilio.jwt.AccessToken(
      accountSid,
      process.env.TWILIO_API_KEY,
      process.env.TWILIO_API_SECRET,
      { ttl: 3600,  identity } 
    );

    // Add TURN grant
    // Probably unnecessary
    const grant = new twilio.jwt.AccessToken.VideoGrant();
    token.addGrant(grant);

    // Create a token instance
    const tokenInstance = await client.tokens.create(); 

    res.json({ 
      token: token.toJwt(),
      iceServers: tokenInstance.ice_servers 
    });
  } catch (error) {
    console.error('Error generating TURN token:', error);
    res.status(500).json({ error: 'Failed to generate token' });
  }
};

module.exports = { generateTurnToken };