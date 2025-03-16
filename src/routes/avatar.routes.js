const express = require('express');
const router = express.Router();
const { generateAvatar } = require('../controller/avatar.controller');

router.get('/:nombre', generateAvatar);

module.exports = router;