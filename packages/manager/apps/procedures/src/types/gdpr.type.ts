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

export type FinalizeValues = Pick<GDPRValues, 'email'>;

export type GDPRFormValues = Omit<GDPRValues, 'numberOfDocuments'> & {
  confirmEmail: string;
  otherDocuments: FileWithError[];
};
