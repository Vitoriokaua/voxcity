import express from 'express';
import cors from 'cors';
import denunciaRoutes from './routes/denuncias.js';

const app = express();

app.use(cors());
app.use(express.json());

//Permite que o frontend acesse as fotos da pasta uploads
app.use('/uploads', express.static('uploads'));

app.use('/denuncias', denunciaRoutes);

app.listen(3001, () => {
  console.log('Servidor rodando na porta 3001');
});