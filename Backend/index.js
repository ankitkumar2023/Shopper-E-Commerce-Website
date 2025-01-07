import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import ProductRoutes from './Routes/ProductRoutes.js';
import UserRoutes from './Routes/UserRoutes.js'
import db from "./db.js";

const app = express();

app.use(bodyParser.json());
app.use(cors());
const port = 3000;

app.use('/product', ProductRoutes)
app.use('/user',UserRoutes)

app.listen(port, () => {
    console.log(`Server is listning at ${port}`);
})