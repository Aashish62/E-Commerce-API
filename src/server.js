import "dotenv/config";
import app from "./app.js";
import models from "./models/index.js";
import generateDocs from "./config/swagger.js";
import serverless from "serverless-http";

const { sequelize } = models;
const PORT = process.env.PORT || 3000;

let dbInitialized = false;
let dbInitializing = false;
let dbInitPromise = null;
let serverlessHandler = null;

// Initialize database with retry logic and exponential backoff
async function initializeDatabase() {
  if (dbInitialized) return true;
  
  // If initialization is in progress, return the existing promise
  if (dbInitPromise) {
    return dbInitPromise;
  }
  
  // Start initialization (non-blocking)
  dbInitPromise = (async () => {
    if (dbInitializing) {
      // Wait for ongoing initialization with timeout
      const waitStart = Date.now();
      const maxWait = 2000; // Max 2 seconds to wait
      while (dbInitializing && !dbInitialized && (Date.now() - waitStart) < maxWait) {
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      return dbInitialized;
    }
    
    dbInitializing = true;
    
    try {
      // Aggressive timeout for serverless (2 seconds)
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database connection timeout')), 2000)
      );
      
      await Promise.race([
        sequelize.authenticate(),
        timeoutPromise
      ]);
      
      console.log("✅ DB connected");
      if (process.env.NODE_ENV === "development") {
        await sequelize.sync({ alter: true });
        console.log("🔄 DB synced");
      }
      
      dbInitialized = true;
      return true;
    } catch (err) {
      console.error("❌ Database connection failed:", err.message);
      dbInitialized = false;
      // Don't throw - let routes handle DB unavailability
      return false;
    } finally {
      dbInitializing = false;
      dbInitPromise = null;
    }
  })();
  
  return dbInitPromise;
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
    // Initialize database connection asynchronously (non-blocking)
    // Don't wait for it - let it happen in the background
    // Routes will handle DB connection errors gracefully
    if (!dbInitialized && !dbInitializing) {
      // Fire and forget - don't await
      initializeDatabase().catch(err => {
        // Silently handle - already logged in initializeDatabase
        console.error("⚠️ Background DB init failed:", err.message);
      });
    }
    
    // Immediately proceed to Express handler without waiting for DB
    // This ensures requests are never blocked by DB initialization
    const handler = getServerlessHandler();
    return await handler(req, res);
  } catch (error) {
    // Ensure we send a response even if something fails
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
