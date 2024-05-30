import { v6 } from '@ovh-ux/manager-core-api';

type UploadLink = {
  link: string;
  method: string;
  headers: any;
};

const getUploadDocumentsLinks = (
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
  return v6.put(link.link, file, {
    headers: {
      ...link.headers,
    },
  });
};

export const uploadDcouments: (files: File[]) => Promise<void> = async (
  files,
) => {
  const links = await getUploadDocumentsLinks(files.length);
  await Promise.all(
    links.map((link, index) => uploadDocument(link, files[index])),
  );
  return finalize();
};
