import express from 'express';
import { env } from '../constants';
import morgan from 'morgan';

const app = express();
const PORT = env.PORT;

app.use(morgan('combined'));
app.use(express.json());

app.use('/', require('./routes/routes'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
