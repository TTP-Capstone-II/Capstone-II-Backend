const twilio = require("twilio");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

const generateTurnToken = async (req, res) => {
  try {
    const identity = req.query.identity || "guest-" + Date.now();

    const token = new twilio.jwt.AccessToken(
      accountSid,
      process.env.TWILIO_API_KEY,
      process.env.TWILIO_API_SECRET,
      { ttl: 3600,  identity } 
    );

    // Add TURN grant
    const grant = new twilio.jwt.AccessToken.VideoGrant();
    token.addGrant(grant);

    const iceServers = await client.tokens.create(); // Twilio returns ICE servers here

    res.json({ 
      token: token.toJwt(),
      iceServers: iceServers.ice_servers // This is what you pass to RTCPeerConnection
    });
  } catch (error) {
    console.error('Error generating TURN token:', error);
    res.status(500).json({ error: 'Failed to generate token' });
  }
};

module.exports = { generateTurnToken };