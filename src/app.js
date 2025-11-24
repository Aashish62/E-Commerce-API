
// import express from 'express';
// import helmet from 'helmet';
// import cors from 'cors';
// import routes from '../src/routes/index.js';
// import { errorHandler } from '../src/middlewares/error.middleware.js';
// import swaggerUi from 'swagger-ui-express';
// import swaggerSpec from '../src/config/swagger.js';

// const app = express();

// app.use(helmet());
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.use('/api', routes);
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// app.use(errorHandler);

// export default app;


import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import routes from './routes/index.js';
import { errorHandler } from './middlewares/error.middleware.js';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from "./config/swagger.json" with { type: "json" };

const app = express();

// Configure Helmet to allow Swagger UI resources
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://cdnjs.cloudflare.com"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'E-Commerce API is running',
    version: '1.0.0',
    endpoints: {
      docs: '/api-docs',
      api: '/api'
    }
  });
});

// Swagger Autogen Docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// API routes
app.use('/api', routes);

// Global error handler
app.use(errorHandler);

export default app;
