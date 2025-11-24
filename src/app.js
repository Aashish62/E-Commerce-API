
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
import swaggerDocument from "../src/config/swagger.json" with { type: "json" };

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger Autogen Docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// API routes
app.use('/api', routes);

// Global error handler
app.use(errorHandler);

export default app;
