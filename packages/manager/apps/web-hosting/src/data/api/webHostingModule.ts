import { v6 } from '@ovh-ux/manager-core-api';

export type ModuleDetails = {
  id: number;
  name: string;
  language: string[];
  version: string;
  active: boolean;
  author: string;
  adminNameType: string;
  latest: boolean;
  branch: string;
  keywords: string[];
  upgradeFrom: string[];
  languageRequirement: {
    unit: string;
    value: string;
  };
  size: {
    unit: string;
    value: number;
  };
};

export const getModuleList = async (active?: boolean, latest?: boolean): Promise<number[]> => {
  const params = new URLSearchParams();
  if (active !== undefined) {
    params.append('active', String(active));
  }
  if (latest !== undefined) {
    params.append('latest', String(latest));
  }
  const queryString = params.toString();
  const url = queryString ? `/hosting/web/moduleList?${queryString}` : `/hosting/web/moduleList`;
  const { data } = await v6.get<number[]>(url);
  return data;
};

export const getModuleDetails = async (moduleId: number): Promise<ModuleDetails> => {
  const { data } = await v6.get<ModuleDetails>(`/hosting/web/moduleList/${moduleId}`);
  return data;
};
