import { FileWithError } from '@/components/FileInput/FileInputContainer';
import { GDPRFormValues } from '@/types/gdpr.type';

export type UploadLink = {
  link: string;
  method: string;
  headers: any;
};

export type FormValue = {
  fileLinks: UploadLink[];
  formData: Omit<
    GDPRFormValues,
    'idDocumentFront' | 'idDocumentBack' | 'otherDocuments'
  >;
  files: FileWithError[];
};
export const sendForm = (value: FormValue): Promise<void> =>
  new Promise((res) => {
    setTimeout(() => {
      res();
    }, 500);
  });

export const getUploadDocumentsLinks = (
  numberOfDocuments: number,
): Promise<UploadLink[]> => {
  return new Promise((res) => {
    setTimeout(() => {
      res([]);
      console.log('value', numberOfDocuments);
    }, 500);
  });
};
