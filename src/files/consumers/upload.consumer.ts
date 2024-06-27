import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import * as streamifier from 'streamifier';
import { Logger } from '@nestjs/common';
import { v2 } from 'cloudinary';

@Processor('upload')
export class UploadConsumer {
    private readonly logger = new Logger(UploadConsumer.name);

    @Process('cloudinary-upload')
    async handleUpload(job: Job<unknown>) {
        const file: Express.Multer.File = job.data['file'];
        const buffer = Buffer.from(file.buffer);
        const extension = job.data['extension'];

        this.logger.log(`Processing upload for file with extension: ${extension}`);

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
            streamifier.createReadStream(buffer).pipe(upload);
        });
    }
}