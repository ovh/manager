import { v2 } from '@ovh-ux/manager-core-api';

export type IAMResource = {
  id: string;
  urn: string;
  name: string;
  displayName: string;
  type: string;
  owner: string;
  tags: IAMTags;
};

export type IAMTags = {
  [key: string]: string;
};

export const getIamResourceAllDom = async (): Promise<IAMResource[]> => {
  const { data } = await v2.get(`iam/resource?resourceType=alldom`);
  return data;
};
