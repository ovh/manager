import { TSshKey } from '@/domain/entities/configuration';

export type TConfigurationPort = {
  selectSshKeys: (projectId: string, regionId: string) => TSshKey[] | undefined;
};
