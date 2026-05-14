import * as FileSystem from 'expo-file-system/legacy';

const PHOTO_DIR = FileSystem.documentDirectory + 'money-capture/photos/';

export async function ensurePhotoDir(): Promise<void> {
  const info = await FileSystem.getInfoAsync(PHOTO_DIR);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(PHOTO_DIR, { intermediates: true });
  }
}

export async function copyPhotoToStorage(tempUri: string, id: string): Promise<string> {
  await ensurePhotoDir();
  const dest = PHOTO_DIR + id + '.jpg';
  await FileSystem.copyAsync({ from: tempUri, to: dest });
  return dest;
}

export async function deletePhoto(uri: string): Promise<void> {
  try {
    const info = await FileSystem.getInfoAsync(uri);
    if (info.exists) {
      await FileSystem.deleteAsync(uri, { idempotent: true });
    }
  } catch {
    // silently ignore — file may already be gone
  }
}
