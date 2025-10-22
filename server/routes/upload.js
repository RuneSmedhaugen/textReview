import express from 'express';
import multer from 'multer';
import {praseFile} from '../utils/fileParser.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('file'), async (req, res) => {
    try {
        const text = await parseFile(req.file);
        res.json({ text });
    } catch (error) {
        console.error('error parsing file: 'error);
        res.status(500).json({ error: 'Failed to parse file' });
    }
});

export default router;