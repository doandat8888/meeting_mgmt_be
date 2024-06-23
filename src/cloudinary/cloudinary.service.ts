import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import { CustomLoggerService } from 'src/logger/logger.service';
import { getExtension } from 'src/utils/get-extension.util';
import { isImageAndPdf } from 'src/utils/image.util';
import * as streamifier from 'streamifier';

@Injectable()
export class CloudinaryService {
  constructor(private readonly logger: CustomLoggerService) {}

  uploadFile(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    const extension = getExtension(file);
    this.logger.log(`Starting upload for file with extension: ${extension}`);

    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream(
        {
          resource_type: 'auto',
          format: extension ? extension : 'zip',
        },
        (error, result) => {
          if (error) {
            this.logger.error(
              'Error uploading file to Cloudinary',
              error.message,
            );
            reject(error);
          }
          this.logger.log('File uploaded successfully to Cloudinary');
          resolve(result);
        },
      );
      streamifier.createReadStream(file.buffer).pipe(upload);
    });
  }

  deleteFile(publicId: string, type: string) {
    this.logger.log(
      `Starting deletion for file with public ID: ${publicId} and type: ${type}`,
    );

    return new Promise((resolve, reject) => {
      v2.uploader.destroy(
        publicId,
        { resource_type: isImageAndPdf(type) ? 'image' : 'raw' },
        (error, result) => {
          if (error) {
            this.logger.error('Error deleting file from Cloudinary', error);
            reject(error);
          }
          this.logger.log('File deleted successfully from Cloudinary');
          resolve(result);
        },
      );
    });
  }
}
