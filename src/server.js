import "dotenv/config";
import app from "../src/app.js";
import models from "../src/models/index.js";
import generateDocs from "../src/config/swagger.js";

const { sequelize } = models;
const PORT = process.env.PORT || 3000;

(async () => {
  try {
    // Only generate swagger when running with: node src/server.js --docs
    if (process.argv.includes("--docs")) {
      await generateDocs();
      process.exit(0);
    }

    await sequelize.authenticate();
    console.log("✅ DB connected");

    await sequelize.sync({ alter: true });
    console.log("🔄 DB synced");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📘 Swagger Docs: http://localhost:${PORT}/api-docs`);
    });

  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
})();

export default app;