import axios from 'axios';

export const uploadImage = async (presignedUrl: string, file: File) => {
  if (!file || !presignedUrl) return;
  
  try {
    await axios.put(presignedUrl, file, {
      headers: {
        'Content-Type': file.type,
      },
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};