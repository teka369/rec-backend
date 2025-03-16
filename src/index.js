const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 3000;

// Habilita CORS para todas las peticiones
app.use(cors());

// Middlewares para parsear los datos de entrada
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = require('./database/db');

// Importa las rutas de autenticación y perfil
const loginRoutes = require('./routes/Login.routes');
const profileRoutes = require('./routes/perfil.routes');
const avatarRoutes = require('./routes/avatar.routes');

// Monta las rutas bajo las rutas base
app.use('/auth', loginRoutes);
app.use('/profile', profileRoutes);
app.use('/api/avatar', avatarRoutes);

app.get('/', (req, res) => {
  res.send('postgresql');
});

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}. ¡A darle con toda!`);
});