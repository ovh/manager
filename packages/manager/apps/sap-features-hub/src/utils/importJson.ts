import { installationInitialValues } from '@/context/installationInitialValues.constants';
import { formMappers } from '../mappers/formMappers';

export const readJsonFile = async (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const text = reader.result;
      if (typeof text === 'string') {
        try {
          const data = JSON.parse(text);
          resolve(data);
        } catch (err) {
          reject(new Error('Invalid JSON file'));
        }
      } else {
        reject(new Error('Invalid type of file'));
      }
    };

    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
};

export const isImportFormCompatible = (data: unknown) => {
  const actualKeys = Object.keys(data || {}).sort();
  const expectedKeys = Object.keys(
    formMappers.toStructured(installationInitialValues),
  ).sort();

  return actualKeys.every((key) => expectedKeys.includes(key));
};
