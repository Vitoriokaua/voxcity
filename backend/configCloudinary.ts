import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// Conecta com a sua conta usando as chaves do .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!
});

// Configura a pasta lá na nuvem
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'voxcity_denuncias', 
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp']
  } as any, // Esse 'as any' evita que o TypeScript reclame das propriedades do Cloudinary
});

const uploadCloudinary = multer({ storage: storage });

export default uploadCloudinary;