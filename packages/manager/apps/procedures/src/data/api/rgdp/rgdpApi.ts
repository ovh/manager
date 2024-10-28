import { v6 } from '@ovh-ux/manager-core-api';
import axios from 'axios';
import { FileWithError } from '@/components/FileInput/FileInputContainer';
import { GDPRValues } from '@/types/gdpr.type';

export type UploadLink = {
  link: string;
  method: string;
  headers: any;
};

type TicketUploadInfo = {
  ticketId: string;
  uploadLinks: UploadLink[];
};

export type UploadDocuments = {
  fileLinks: UploadLink[];
  files: FileWithError[];
};

const s3AxiosInstance = axios.create({});

export const getUploadDocumentsLinks = (
  data: GDPRValues,
): Promise<UploadLink[]> => {
  // TODO: remove the mock in the ticket MANAGER-15473
  // return v6.post<TicketUploadInfo>('/me/procedure/GDPR', data).then(({ data }) => data.uploadLinks);
  return new Promise((res) => {
    setTimeout(() => {
      res([]);
      console.log('value', data);
    }, 500);
  });
};

const uploadDocument: (
  link: UploadLink,
  file: FileWithError,
) => Promise<void> = (link, file) => {
  // TODO: remove the mock in the ticket MANAGER-15473
  // return s3AxiosInstance.put(link.link, file, {
  //   headers: {
  //     ...link.headers,
  //   },
  // });
  return new Promise((res) => {
    setTimeout(() => {
      res();
    }, 500);
  });
};

export const uploadDocuments = ({
  fileLinks,
  files,
}: UploadDocuments): Promise<void[]> => {
  return Promise.all(
    fileLinks.map((link, index) => uploadDocument(link, files[index])),
  );
};

export const finalize = (): Promise<void> => {
  // TODO: remove the mock in the ticket MANAGER-15473
  // return v6.post('/me/procedure/GDPR/finalize').then(({ data }) => data);
  return new Promise((res) => {
    setTimeout(() => {
      res();
    }, 500);
  });
};
