import { v6 } from '@ovh-ux/manager-core-api';
import axios from 'axios';
import { Procedure } from '@/types/procedure';

export type UploadLink = {
  link: string;
  method: string;
  headers: any;
};

const s3AxiosInstance = axios.create({});

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

export const getProceduresAPI = (procedure: Procedure) => {
  const uri = `/me/procedure/${procedure}`;

  const getStatus: <TResponse>() => Promise<TResponse> = async () => {
    const { data } = await v6.get(uri);
    return data;
  };

  const getDocumentsLinks = <TData extends { numberOfDocuments: number }>(
    dataQuery: TData,
  ): Promise<UploadLink[]> => {
    return v6
      .post(uri, dataQuery)
      .then(({ data: dataResponse }) => dataResponse.uploadLinks);
  };

  const finalize: () => Promise<void> = () => {
    return v6.post(`${uri}/finalize`).then(({ data }) => data);
  };

  const uploadDocuments: (
    files: File[],
    links: UploadLink[],
  ) => Promise<void> = async (files, links) => {
    await Promise.all(
      links.map((link, index) => uploadDocument(link, files[index])),
    );
    return finalize();
  };

  return {
    getStatus,
    getDocumentsLinks,
    uploadDocuments,
  };
};
