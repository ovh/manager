import { TSshKey } from '@/domain/entities/configuration';

export type ConfigurationPort = {
  selectSshKeys: (projectId: string, regionId: string) => TSshKey[] | undefined;
};
