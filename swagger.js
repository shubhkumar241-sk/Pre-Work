const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
require("dotenv").config();
const isProduction = process.env.SERVER === "PRODUCTION";

const serverUrl = isProduction
    ? "https://operation-management-system.onrender.com" // ✅ Render production URL
    : "http://localhost:3000"; // ✅ Local dev URL


const options = {
    definition: {
        openapi: "3.0.0", // ✅ Required field

        info: {
            title: "Operation Management System API",
            version: "1.0.0",
            description: `

<div style="font-size:14px; line-height:1.4; background-color:#fff; padding:5px;margin:0px">

  <h3>📘 Routes Overview</h3>
  <table style="width:100%; border-collapse:collapse; text-align:left; margin-bottom:30px;">
    <thead style="background:#f8f8f8;">
      <tr>
        <th style="padding:10px; border:1px solid #ddd;">Method</th>
        <th style="padding:10px; border:1px solid #ddd;">Endpoint</th>
        <th style="padding:10px; border:1px solid #ddd;">Description</th>
      </tr>
    </thead>
    <tbody>
      <tr><td style="padding:8px; border:1px solid #ddd;">POST</td><td style="padding:8px; border:1px solid #ddd;">/records/addRecord</td><td style="padding:8px; border:1px solid #ddd;">Add a new record</td></tr>
      <tr><td style="padding:8px; border:1px solid #ddd;">GET</td><td style="padding:8px; border:1px solid #ddd;">/records/getRecords</td><td style="padding:8px; border:1px solid #ddd;">Retrieve all or filter by status</td></tr>
      <tr><td style="padding:8px; border:1px solid #ddd;">PUT</td><td style="padding:8px; border:1px solid #ddd;">/records/updateRecord</td><td style="padding:8px; border:1px solid #ddd;">Update a record</td></tr>
      <tr><td style="padding:8px; border:1px solid #ddd;">DELETE</td><td style="padding:8px; border:1px solid #ddd;">/records/deleteRecord</td><td style="padding:8px; border:1px solid #ddd;">Delete a record</td></tr>
    </tbody>
  </table>

  <h3>🧩 Order Management API</h3>
  <table style="width:100%; border-collapse:collapse; text-align:left;">
    <thead style="background:#f8f8f8;">
      <tr>
        <th style="padding:10px; border:1px solid #ddd;">Method</th>
        <th style="padding:10px; border:1px solid #ddd;">Endpoint</th>
        <th style="padding:10px; border:1px solid #ddd;">Description</th>
      </tr>
    </thead>
    <tbody>
      <tr><td style="padding:8px; border:1px solid #ddd;">POST</td><td style="padding:8px; border:1px solid #ddd;">/orders/addCustomer</td><td style="padding:8px; border:1px solid #ddd;">Add a new customer</td></tr>
      <tr><td style="padding:8px; border:1px solid #ddd;">GET</td><td style="padding:8px; border:1px solid #ddd;">/orders/getCustomers</td><td style="padding:8px; border:1px solid #ddd;">Retrieve all customers</td></tr>
      <tr><td style="padding:8px; border:1px solid #ddd;">POST</td><td style="padding:8px; border:1px solid #ddd;">/orders/addProduct</td><td style="padding:8px; border:1px solid #ddd;">Add a new product</td></tr>
      <tr><td style="padding:8px; border:1px solid #ddd;">GET</td><td style="padding:8px; border:1px solid #ddd;">/orders/getProducts</td><td style="padding:8px; border:1px solid #ddd;">Retrieve all products</td></tr>
      <tr><td style="padding:8px; border:1px solid #ddd;">POST</td><td style="padding:8px; border:1px solid #ddd;">/orders/addOrder</td><td style="padding:8px; border:1px solid #ddd;">Create a new order</td></tr>
      <tr><td style="padding:8px; border:1px solid #ddd;">GET</td><td style="padding:8px; border:1px solid #ddd;">/orders/getOrders</td><td style="padding:8px; border:1px solid #ddd;">Retrieve all orders</td></tr>
      <tr><td style="padding:8px; border:1px solid #ddd;">GET</td><td style="padding:8px; border:1px solid #ddd;">/orders/getRecentOrders</td><td style="padding:8px; border:1px solid #ddd;">Get all orders from last 30 days</td></tr>
      <tr><td style="padding:8px; border:1px solid #ddd;">GET</td><td style="padding:8px; border:1px solid #ddd;">/orders/topCustomers</td><td style="padding:8px; border:1px solid #ddd;">Get top 3 customers by total orders</td></tr>
      <tr><td style="padding:8px; border:1px solid #ddd;">GET</td><td style="padding:8px; border:1px solid #ddd;">/orders/productRevenue</td><td style="padding:8px; border:1px solid #ddd;">Calculate total revenue for each product</td></tr>
      <tr><td style="padding:8px; border:1px solid #ddd;">POST</td><td style="padding:8px; border:1px solid #ddd;">/orders/addPayment</td><td style="padding:8px; border:1px solid #ddd;">Record a payment for an order</td></tr>
      <tr><td style="padding:8px; border:1px solid #ddd;">GET</td><td style="padding:8px; border:1px solid #ddd;">/orders/getPayments</td><td style="padding:8px; border:1px solid #ddd;">Retrieve all payments</td></tr>
    </tbody>
  </table>

</div>

      `,
            // contact: {
            //     name: "API Support",
            //     email: "support@example.com",
            // },
            // license: {
            //     name: "MIT",
            //     url: "https://opensource.org/licenses/MIT",
            // },
        },
        servers: [
            {
                url: serverUrl,
                description: isProduction
                    ? "Render Production Server"
                    : "Local Development Server",
            },
        ],
        tags: [
      { name: "Records", description: "CRUD operations for general records" },
      { name: "Orders", description: "Customer and order management" },
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
    apis: ["./routes/*.js", "./swagger/*.yaml"], // 🔍 scan route files for Swagger comments
};

const swaggerSpec = swaggerJsDoc(options);

function swaggerDocs(app) {
    app.use(
        "/api-docs",
        swaggerUi.serve,
        swaggerUi.setup(swaggerSpec, {
            swaggerOptions: {
                persistAuthorization: true,
                authAction: {
        ApiKeyAuth: {
          name: "x-api-key",
          schema: {
            type: "apiKey",
            in: "header",
            name: "x-api-key",
          },
          value: process.env.API_KEY, // 👈 auto-inject API key
        },
        }
    }
        })
    );

    console.log(`📘 Swagger Docs available at: ${serverUrl}/api-docs`);
}

module.exports = swaggerDocs;
