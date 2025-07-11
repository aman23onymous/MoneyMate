// Import required modules
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { SessionsClient } from "@google-cloud/dialogflow";
import { fileURLToPath } from "url";
import fs from "fs";

// __dirname workaround for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read credentials JSON manually (sync or async both work)
const credentialsPath = path.join(__dirname, "../../moneymate-cuxs-33f6e2f6a771.json");
const CREDENTIALS = JSON.parse(fs.readFileSync(credentialsPath, "utf-8"));

const PROJECT_ID = CREDENTIALS.project_id;

// Initialize Dialogflow session client
const sessionClient = new SessionsClient({
  credentials: {
    client_email: CREDENTIALS.client_email,
    private_key: CREDENTIALS.private_key,
  },
});

// Main controller function to handle chat messages
export const handleChat = async (req, res) => {
  const { message } = req.body;
  const sessionId = uuidv4(); // Unique session per request
  const sessionPath = sessionClient.projectAgentSessionPath(PROJECT_ID, sessionId);

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: message,
        languageCode: "en",
      },
    },
  };

  try {
    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;
    res.json({ reply: result.fulfillmentText });
  } catch (error) {
    console.error("Dialogflow Error:", error);
    res.status(500).json({ error: "Dialogflow request failed" });
  }
};
