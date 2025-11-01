const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
require("dotenv").config();

const options = {
  definition: {
    openapi: "3.0.0", // ✅ Required field
    
    info: {
      title: "Records API",
      version: "1.0.0",
      description: `
A simple **REST API** built with **Express** and **SQL**.

---

### 🔐 Authentication
All endpoints require an **API Key** for access.

Add this header in Swagger (via the "Authorize" button):

\`\`\`
x-api-key: ${process.env.API_KEY || "YOUR_API_KEY_HERE"}
\`\`\`

---

### 📘 Routes Overview
| Method | Endpoint | Description |
|--------|-----------|-------------|
| POST | /api/records/addRecord | Add a new record |
| GET | /api/records/getRecords | Retrieve all or filter by status |
| PUT | /api/records/updateRecord | Update a record |
| DELETE | /api/records/deleteRecord | Delete a record |

---
      `,
      contact: {
        name: "API Support",
        email: "support@example.com",
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local Development Server",
      },
    ],
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: "apiKey",
          in: "header",
          name: "x-api-key",
          description: "Provide your API key (from .env file)",
        },
      },
    },
    security: [
      {
        ApiKeyAuth: [],
      },
    ],
  },
  apis: ["./routes/*.js"], // 🔍 scan route files for Swagger comments
};

const swaggerSpec = swaggerJsDoc(options);

function swaggerDocs(app) {
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      swaggerOptions: {
        persistAuthorization: true, // ✅ keeps API key saved after authorization
      },
    })
  );

  console.log(`📘 Swagger Docs available at: http://localhost:3000/api-docs`);
}

module.exports = swaggerDocs;
