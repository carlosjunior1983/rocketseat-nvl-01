import express, { request } from 'express';
import path from 'path';
import cors from 'cors';
import routes from './routes';
import { errors } from 'celebrate';


const app = express();


app.use(cors());
app.use(express.json()); //Configurar o express para utilizar padrão json;
app.use(routes);

app.use('/uploads', express.static(path.resolve(__dirname, '..','uploads'))); //Rota para mostrar imagens.
app.use('/uploads/imagepoints', express.static(path.resolve(__dirname, '..','uploads','imagepoints'))); //Rota para mostrar imagens.
 
app.use(errors());

app.listen(3333);