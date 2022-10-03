import express from 'express'
import cors from 'cors';
import AngkaRoutes from './routes/AngkaRoutes.js'

const app = express();
app.use(cors());
app.use(express.json());
app.use(AngkaRoutes);

app.listen(5000, ()=> console.log('server sedang berjalan'))