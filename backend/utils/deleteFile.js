import { unlink } from 'fs/promises';
import __dirname from '../index.js';
import path from 'path';

// console.log(__dirname);
// console.log(path.join(__dirname, 'public', 'img', 'products'));

const deleteFile = async (filePath) => {
  try {
    await unlink(filePath);
    console.log('File deleted successfully!');
  } catch (error) {
    console.error('Error deleting the file:', error);
  }
};

export default deleteFile;
