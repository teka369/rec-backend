const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || 'tu_clave_secreta';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  // Se espera que el token venga en el formato: Bearer <token>
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  jwt.verify(token, secret, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido' });
    }
    req.user = user;
    next();
  });
};

module.exports = { authenticateToken };
