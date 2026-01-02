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
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use('/auth',authRoutes);
app.use('/users', userRoutes);
app.use('/forms',formRoutes);
app.use('/treasurer',treasurerRoutes);
app.use('/secretary',secretaryRoutes);
app.use('/membership',membershipRoutes);

app.get('/', (req, res) => {
  res.send('API is running');
});

export default app;