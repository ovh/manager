import { v6 } from '@ovh-ux/manager-core-api';
import { AxiosError } from 'axios';

export type TNewGateway = {
  name: string;
  model: string;
};

export const createGateway = async (
  projectId: string,
  regionName: string,
  networkId: string,
  subnetId: string,
  newGateway: TNewGateway,
) => {
  const url = `/cloud/project/${projectId}/region/${regionName}/network/${networkId}/subnet/${subnetId}/gateway`;

  try {
    const { data } = await v6.post(url, newGateway);

    return data;
  } catch (e) {
    const error = e as AxiosError;
    throw new Error((error.response.data as { message: string })?.message);
  }
};
