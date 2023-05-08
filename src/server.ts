import express from 'express';
import { env } from '../constants';
import morgan from 'morgan';
import cors from 'cors';

const app = express();
const PORT = env.PORT;

app.use(morgan('combined'));
app.use(express.json());
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'https://api.contentwatchdog.karanchugh.in',
    ],
  })
);

app.use('/', require('./routes/routes'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
