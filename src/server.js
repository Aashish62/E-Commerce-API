import "dotenv/config";
import app from "./app.js";
import models from "./models/index.js";
import generateDocs from "./config/swagger.js";
import serverless from "serverless-http";

const { sequelize } = models;
const PORT = process.env.PORT || 3000;

let dbInitialized = false;
let serverlessHandler = null;

async function initializeDatabase() {
  if (dbInitialized) return;
  
  try {
    await sequelize.authenticate();
    console.log("✅ DB connected");
    if (process.env.NODE_ENV === "development") {
      await sequelize.sync({ alter: true });
      console.log("🔄 DB synced");
    }
    
    dbInitialized = true;
  } catch (err) {
    console.error("❌ Database connection failed:", err);
    throw err;
  }
}

// Local development server
if (process.argv.includes("--docs")) {
  (async () => {
    await generateDocs();
    process.exit(0);
  })();
} else if (process.env.NODE_ENV === "production" || !process.env.VERCEL) {
  (async () => {
    try {
      await initializeDatabase();
      
      app.listen(PORT, () => {
        console.log(`Server started on port : ${PORT}`);
        console.log(`📘 Swagger Docs: http://localhost:${PORT}/api-docs`);
      });
    } catch (err) {
      console.error("❌ Failed to start server:", err);
      process.exit(1);
    }
  })();
}

// Initialize serverless handler lazily
function getServerlessHandler() {
  if (!serverlessHandler) {
    serverlessHandler = serverless(app, {
      binary: ['image/*', 'application/pdf']
    });
  }
  return serverlessHandler;
}

export default async function handler(req, res) {
  try {
    // Initialize database connection if not already done
    if (!dbInitialized) {
      await initializeDatabase();
    }
    
    // Use serverless-http to properly handle Express app
    const handler = getServerlessHandler();
    return await handler(req, res);
  } catch (error) {
    // Ensure we send a response even if initialization fails
    console.error("❌ Handler error:", error);
    
    // If headers haven't been sent, send error response
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: process.env.NODE_ENV === "development" ? error.message : undefined
      });
    }
    
    // Return to prevent further execution
    return;
  }
}
