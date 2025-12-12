import queryClient from '@/queryClient';
import { sshKeysQueryKey } from '../queryKeys';
import { TSshKey } from '@/domain/entities/configuration';
import { ConfigurationPort } from '@/domain/port/configuration/left/port';

export const configurationAdapter: ConfigurationPort = {
  selectSshKeys: (projectId: string, regionId: string) =>
    queryClient.getQueryData<TSshKey[]>(sshKeysQueryKey(projectId, regionId)),
};
