import multer from "multer";

const storage = multer.memoryStorage();
export const uploadFiles = multer({ storage }).fields([
    { name: 'profilePhoto', maxCount: 1 }, // Handling profile photo
    { name: 'resume', maxCount: 1 },       // Handling resume
  ]);


  export const singleUpload = multer({ storage }).single('file'); 
