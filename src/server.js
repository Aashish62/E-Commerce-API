import "dotenv/config";
import app from "./app.js";
import models from "./models/index.js";
import generateDocs from "./config/swagger.js";
import serverless from "serverless-http";

const { sequelize } = models;
const PORT = process.env.PORT || 3000;

let dbInitialized = false;
let dbInitializing = false;
let serverlessHandler = null;

async function initializeDatabase() {
  if (dbInitialized) return;
  if (dbInitializing) {
    // Wait for ongoing initialization
    while (dbInitializing && !dbInitialized) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return;
  }
  
  dbInitializing = true;
  
  try {
    // Add timeout to prevent hanging (10 seconds)
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Database connection timeout')), 10000)
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
  } catch (err) {
    console.error("❌ Database connection failed:", err);
    dbInitialized = false;
    throw err;
  } finally {
    dbInitializing = false;
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
    // Use non-blocking approach - try to initialize but don't block requests
    if (!dbInitialized) {
      // Try to initialize, but with timeout to prevent hanging
      try {
        await Promise.race([
          initializeDatabase(),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('DB init timeout')), 5000)
          )
        ]);
      } catch (dbError) {
        // Log error but continue - let routes handle DB availability
        console.error("⚠️ Database not available:", dbError.message);
        // Don't block the request - proceed to handler
      }
    }
    
    // Always proceed to Express handler - it will handle routing and DB errors
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
