import 'dotenv/config'; 
import express from 'express';
import cors from 'cors';
import denunciaRoutes from './routes/denuncias.js';
import authRoutes from './routes/auth.js';

const app = express();

app.use(cors());
app.use(express.json());


app.use('/uploads', express.static('uploads'));

app.use('/denuncias', denunciaRoutes);
app.use('/auth', authRoutes);

app.listen(3001, () => {
  console.log('Servidor rodando na porta 3001');
});