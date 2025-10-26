import { CloudinaryStorage } from 'multer-storage-cloudinary';
import * as multer from 'multer';
import cloudinary from '../config/cloudinary.config';

export const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'student-portal',
    allowed_formats: ['jpg', 'png', 'jpeg', 'pdf'],
  } as any,
});

export const upload = multer({ storage });
