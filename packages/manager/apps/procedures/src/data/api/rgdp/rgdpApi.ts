import { FileWithError } from '@/components/FileInput/FileInputContainer';
import { GDPRFormValues } from '@/types/gdpr.type';

export type UploadLink = {
  link: string;
  method: string;
  headers: any;
};

export type GetUploadDocumentsLinks = {
  numberOfDocuments: number;
  formData: Omit<
    GDPRFormValues,
    'idDocumentFront' | 'idDocumentBack' | 'otherDocuments'
  >;
};

export type UploadDocuments = {
  fileLinks: UploadLink[];
  files: FileWithError[];
};

export const getUploadDocumentsLinks = ({
  formData,
  numberOfDocuments,
}: GetUploadDocumentsLinks): Promise<UploadLink[]> => {
  return new Promise((res) => {
    setTimeout(() => {
      res([]);
      console.log('value', numberOfDocuments, formData);
    }, 500);
  });
};

export const uploadDocuments = (documents: UploadDocuments): Promise<void> =>
  new Promise((res) => {
    setTimeout(() => {
      res();
    }, 500);
  });

export const finalize = (): Promise<void> =>
  new Promise((res) => {
    setTimeout(() => {
      res();
    }, 500);
  });
