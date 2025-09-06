import { apiClient } from '@ovh-ux/manager-core-api';
import axios from 'axios';

export type MeDocument = {
  id: string;
  putUrl: string;
};

export type Tag = {
  key: string;
  value: string;
};

export type MeDocumentResponse = {
  putUrl: string;
  size: number;
  id: string;
  expirationDate?: string;
  getUrl: string;
  creationDate: string;
  validationDate: string;
  name: string;
  tags: Tag[];
};

export const getMeDocument = async (id: string): Promise<MeDocument> => {
  const { data } = await apiClient.v6.get(`/me/document/${id}`);
  return data as MeDocumentResponse;
};

const postMeDocument = async (
  filename: string,
): Promise<MeDocumentResponse> => {
  const { data } = await apiClient.v6.post(`/me/document`, { name: filename });
  return data as MeDocumentResponse;
};

const postMeDocumentCors = async (origin: string): Promise<void> => {
  return apiClient.v6.post(`/me/document/cors`, {
    origin,
  });
};

const customAxiosInstance = axios.create({});

const saveDocumentFile = async (putUrl: string, file: File): Promise<void> => {
  return customAxiosInstance.put(putUrl, file, {
    headers: {
      'Content-type': 'multipart/form-data',
    },
  });
};

export const saveFile = async (file: File) => {
  const response = await postMeDocument(file.name);
  await postMeDocumentCors(window.location.origin);
  await saveDocumentFile(response.putUrl, file);
  return response.id;
};
