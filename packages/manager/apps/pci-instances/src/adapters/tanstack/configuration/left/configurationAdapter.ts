import queryClient from '@/queryClient';
import { sshKeysQueryKey } from '../queryKeys';
import { TSshKey } from '@/domain/entities/configuration';
import { TConfigurationPort } from '@/domain/port/configuration/left/port';

export const configurationAdapter: TConfigurationPort = {
  selectSshKeys: (projectId: string, regionId: string) =>
    queryClient.getQueryData<TSshKey[]>(sshKeysQueryKey(projectId, regionId)),
};
