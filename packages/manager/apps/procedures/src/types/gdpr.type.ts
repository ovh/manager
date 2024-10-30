import { FileWithError } from '@/components/FileInput/FileInputContainer';

export type GDPRValues = {
  firstName: string;
  name: string;
  email: string;
  nichandle?: string;
  category: string;
  description: string;
  numberOfDocuments: number;
};

export type GDPRFormValues = Omit<GDPRValues, 'numberOfDocuments'> & {
  confirmEmail: string;
  idDocumentFront: FileWithError[];
  idDocumentBack: FileWithError[];
  otherDocuments: FileWithError[];
};
