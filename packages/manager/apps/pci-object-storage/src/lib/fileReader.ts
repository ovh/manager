export type Json =
  | string
  | number
  | boolean
  | null
  | Json[]
  | { [key: string]: Json };

export const readJsonFile = (file: File): Promise<Json> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content) as Json;
        resolve(parsed);
      } catch (err) {
        reject(new Error('unableToReadFile'));
      }
    };

    reader.onerror = () => {
      reject(new Error('unableToReadFile'));
    };

    reader.readAsText(file);
  });
};
