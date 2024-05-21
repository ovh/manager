import { v6 } from '@ovh-ux/manager-core-api';

export interface Stein {
  date: string;
  zone: string;
  travaux: string;
}

export const getMigrationSteins = async (): Promise<Stein[]> => {
  const { data } = await v6.get<Stein[]>('/cloud/migrationStein');
  return data;
};
