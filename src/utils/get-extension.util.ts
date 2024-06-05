export const getExtension = (file: Express.Multer.File): string => {
    const parts = file.originalname.split('.');
    const extension = parts[parts.length - 1];
    return extension;
}