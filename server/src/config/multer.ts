import multer from 'multer';
import path from 'path';
import cryto from 'crypto';

export default {
    storage : multer.diskStorage({
        destination: path.resolve(__dirname, "..", "..","uploads", "imagepoints"),
        filename(request, file, callback){
            const hash = cryto.randomBytes(6).toString('hex');

            const fileName = `${hash}-${file.originalname}`;

            callback( null, fileName);
        }
    }), 
}