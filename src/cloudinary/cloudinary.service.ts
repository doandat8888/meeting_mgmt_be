import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import { getExtension } from 'src/utils/get-extension.util';
import * as streamifier from 'streamifier';

@Injectable()
export class CloudinaryService {
    uploadFile(file: Express.Multer.File): Promise<UploadApiResponse | UploadApiErrorResponse> {
        const extension = getExtension(file);
        return new Promise((resolve, reject) => {
            const upload = v2.uploader.upload_stream(
                {
                    resource_type: 'auto',
                    format: extension ? extension : 'zip'
                },
                (error, result) => {
                    if (error) {
                        console.log(error);
                        reject(error);
                    }
                    resolve(result);
                }
            );
            streamifier.createReadStream(file.buffer).pipe(upload);
        })
    }
}
