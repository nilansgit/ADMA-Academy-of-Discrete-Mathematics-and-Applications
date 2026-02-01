import express from 'express';
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from './routes/user.routes.js';
import formRoutes from './routes/forms.routes.js';
import treasurerRoutes from './routes/treasurer.routes.js'
import secretaryRoutes from './routes/secretary.routes.js'
import membershipRoutes from './routes/membership.routes.js'

const app = express();
app.use(express.json());
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Type', 'Authorization'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  maxAge: 86400,
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.options('*', cors());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth',authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/forms',formRoutes);
app.use('/api/treasurer',treasurerRoutes);
app.use('/api/secretary',secretaryRoutes);
app.use('/api/membership',membershipRoutes);

app.get('/', (req, res) => {
  res.send('API is running');
});

export default app;