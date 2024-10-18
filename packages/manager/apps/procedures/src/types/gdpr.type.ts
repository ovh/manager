import { FileWithError } from '@/components/FileInput/FileInputContainer';

export type GDPRFormValues = {
  firstName: string;
  surname: string;
  phone: string;
  email: string;
  confirmEmail: string;
  nicHandle?: string;
  messageSubject: string;
  requestDescription: string;
  idDocumentFront: FileWithError[];
  idDocumentBack: FileWithError[];
  otherDocuments: FileWithError[];
};
