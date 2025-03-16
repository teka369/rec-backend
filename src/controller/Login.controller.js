const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../database/db');
const saltRounds = 10;
const secret = process.env.JWT_SECRET || 'tu_clave_secreta';

const register = async (req, res) => {
  const { nombre, correo_electronico, contraseña, confirmar_contraseña, grado } = req.body;
  
  // Validación básica
  if (!nombre || !correo_electronico || !contraseña || !confirmar_contraseña) {
    return res.status(400).json({ message: 'Todos los campos son requeridos.' });
  }
  if (contraseña !== confirmar_contraseña) {
    return res.status(400).json({ message: 'Las contraseñas no coinciden.' });
  }
  
  try {
    // Verifica si el correo ya existe
    const { rows } = await pool.query(
      'SELECT * FROM usuarios WHERE correo_electronico = $1',
      [correo_electronico]
    );
    if (rows.length > 0) {
      return res.status(400).json({ message: 'El correo electrónico ya está registrado.' });
    }
    
    // Hashea la contraseña
    const hashedPassword = await bcrypt.hash(contraseña, saltRounds);
    
    // Inserta el nuevo usuario en la base de datos (incluye grado)
    const newUser = await pool.query(
      'INSERT INTO usuarios (nombre, correo_electronico, contraseña, grado) VALUES ($1, $2, $3, $4) RETURNING *',
      [nombre, correo_electronico, hashedPassword, grado]
    );
    
    return res.status(201).json({ message: 'Usuario registrado exitosamente', user: newUser.rows[0] });
  } catch (error) {
    console.error('Error en registro:', error);
    return res.status(500).json({ message: 'Error del servidor.' });
  }
};

const login = async (req, res) => {
  const { correo_electronico, contraseña } = req.body;
  
  if (!correo_electronico || !contraseña) {
    return res.status(400).json({ message: 'Correo electrónico y contraseña son requeridos.' });
  }
  
  try {
    // Busca el usuario por correo
    const { rows } = await pool.query(
      'SELECT * FROM usuarios WHERE correo_electronico = $1',
      [correo_electronico]
    );
    if (rows.length === 0) {
      return res.status(400).json({ message: 'Usuario no encontrado.' });
    }
    
    const usuario = rows[0];
    const isValidPassword = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Contraseña incorrecta.' });
    }
    
    // Genera el token con la información del usuario (incluye grado)
    const token = jwt.sign(
      {
        id: usuario.id,
        nombre: usuario.nombre,
        correo_electronico: usuario.correo_electronico,
        grado: usuario.grado,
      },
      secret,
      { expiresIn: '1h' }
    );
    
    return res.status(200).json({ message: 'Inicio de sesión exitoso', user: usuario, token });
  } catch (error) {
    console.error('Error en inicio de sesión:', error);
    return res.status(500).json({ message: 'Error del servidor.' });
  }
};

module.exports = { register, login };