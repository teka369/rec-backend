const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/authMiddleware');
const { getProfile } = require('../controller/perfil.controller');

router.get('/', authenticateToken, getProfile);

module.exports = router;
