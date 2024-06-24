export const isImageAndPdf = (type: string): boolean => {
    return type === 'jpeg' || type === 'jpg'|| type === 'png' || type === 'gif' || type === 'webp'|| type === 'pdf';
}
