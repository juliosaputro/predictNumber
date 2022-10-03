import express from 'express'
import { getAngkas, getAngkasById, createAngkas, deleteAngkas, getKepalaEkor} from '../controllers/AngkaController.js'

const router = express.Router();

router.get('/angkas', getKepalaEkor);
// router.get('/angkas', getAngkas);
// router.get('/angkas', getAngkasByEkor);
router.get('/angkas/:id', getAngkasById);
router.post('/angkas', createAngkas);
router.delete('/angkas/:id', deleteAngkas);

export default router;