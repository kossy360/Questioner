import Router from 'express';
import multer from 'multer';
import meetups from '../controllers/meetups';
import cloud from '../cloudinary';

const upload = multer();

const router = Router();

router.post('/meetups', meetups.createNew);

router.post('/meetups/images', upload.any(), cloud);
export default router;
