//apenas exemplos


const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/athleteController');

router.use(auth); // protege todas as rotas desta rota

router.post('/', ctrl.criar);
router.get('/', ctrl.listar);
router.get('/:id', ctrl.buscarPorId);
router.put('/:id', ctrl.atualizar);
router.delete('/:id', ctrl.deletar);

module.exports = router;

