const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json([
      { id: 1, name: 'Board 1' },
      { id: 2, name: 'Board 2' },
    ]);
  });

module.exports = router;