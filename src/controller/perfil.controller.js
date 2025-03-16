const pool = require('../database/db');

const getProfile = async (req, res) => {
  try {
    // Obtener el id del usuario desde el token
    const { id } = req.user;
        
    // Consultar la base de datos para traer toda la info del usuario
    const { rows } = await pool.query('SELECT * FROM usuarios WHERE id = $1', [id]);
        
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }
        
    const user = rows[0];
        
    // Agregar la URL para la imagen de avatar basada en la primera letra del nombre
    const avatarUrl = `/api/avatar/${encodeURIComponent(user.nombre)}`;
    user.avatarUrl = avatarUrl;
        
    return res.status(200).json({ 
      message: 'Perfil del usuario', 
      user: {
        id: user.id,
        nombre: user.nombre,
        correo_electronico: user.correo_electronico,
        grado: user.grado,
        avatarUrl: user.avatarUrl
      } 
    });
  } catch (error) {
    console.error('Error en getProfile:', error);
    return res.status(500).json({ message: 'Error del servidor.' });
  }
};

module.exports = { getProfile };