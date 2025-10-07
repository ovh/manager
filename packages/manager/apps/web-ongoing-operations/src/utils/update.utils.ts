import pLimit from 'p-limit';
import { saveFile } from '@/data/api/document';
import { updateTask } from '@/data/api/web-ongoing-operations';

const limit = pLimit(1);

export const saveFileAndUpdateOperation = async (
  operationID: number,
  key: string,
  file: File,
) => {
  const documentId = await saveFile(file);
  const body = { value: documentId };
  updateTask(operationID, key, body);
};

export const processFile = async (
  file: File,
  key: string,
  operationID: number,
) => {
  return limit(() => saveFileAndUpdateOperation(operationID, key, file));
};

export const processUploadedFiles = async (
  operationID: number,
  uploadedFiles: Record<string, File[]>,
) => {
  const tasks = Object.entries(uploadedFiles).flatMap(([key, files]) =>
    files.map((file) => processFile(file, key, operationID)),
  );

  await Promise.all(tasks);
};
