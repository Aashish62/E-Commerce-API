import "dotenv/config";
import app from "./app.js";
import models from "./models/index.js";
import generateDocs from "./config/swagger.js";

const { sequelize } = models;
const PORT = process.env.PORT || 3000;

let dbInitialized = false;

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
} else if (process.env.NODE_ENV === "development" || !process.env.VERCEL) {
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

export default async function handler(req, res) {
  if (!dbInitialized) {
    await initializeDatabase();
  }
  
  return app(req, res);
}
