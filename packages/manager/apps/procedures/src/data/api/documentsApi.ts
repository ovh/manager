import { v6 } from '@ovh-ux/manager-core-api';
import axios from 'axios';

export type UploadLink = {
  link: string;
  method: string;
  headers: any;
};

const s3AxiosInstance = axios.create({});

export const getUploadDocumentsLinks = (
  numberOfDocuments: number,
): Promise<UploadLink[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve([]), 5000);
  });
};

const finalize: () => Promise<void> = () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), 5000);
  });
};

const uploadDocument: (link: UploadLink, file: File) => Promise<void> = (
  link,
  file,
) => {
  return s3AxiosInstance.put(link.link, file, {
    headers: {
      ...link.headers,
    },
  });
};

export const uploadDocuments: (
  files: File[],
  links: UploadLink[],
) => Promise<void> = async (files, links) => {
  await Promise.all(
    links.map((link, index) => uploadDocument(link, files[index])),
  );
  return finalize();
};
