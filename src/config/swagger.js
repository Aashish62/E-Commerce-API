
import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "E-Commerce API",
    description: "Manual Swagger documentation",
  },
  host: "",
  basePath: "/api",
  schemes: ["http", "https"],
  securityDefinitions: {
    BearerAuth: {
      type: "apiKey",
      name: "Authorization",
      in: "header",
      description: "Enter: Bearer <token>",
    },
  },
  security: [{ BearerAuth: [] }],
  autoHeaders: false,   
  autoQuery: false,     
  autoBody: false,      
  tags: [
    { name: "Auth", description: "User authentication endpoints" },
    { name: "Categories", description: "Category management" },
    { name: "Products", description: "Product management" },
    { name: "Cart", description: "Cart operations" },
    { name: "Orders", description: "Order processing" },
  ],
};

const outputFile = "../src/config/swagger.json";
const endpointsFiles = ["./src/routes/index.js"];

const generateDocs = async () => {
  const autogen = swaggerAutogen();
  await autogen(outputFile, endpointsFiles, doc);
  console.log("📘 Swagger documentation generated successfully!");
};

export default generateDocs;
