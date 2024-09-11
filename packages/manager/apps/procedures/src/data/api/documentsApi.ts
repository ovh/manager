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
  return v6
    .post('/me/procedure/2FA', {
      numberOfDocuments,
    })
    .then(({ data }) => data.uploadLinks);
};

const finalize: () => Promise<void> = () => {
  return v6.post('/me/procedure/2FA/finalize').then(({ data }) => data);
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
