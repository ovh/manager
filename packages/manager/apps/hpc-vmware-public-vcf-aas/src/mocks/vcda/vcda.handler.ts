import { Handler } from '@ovh-ux/manager-core-test-utils';
import { PublicVcda } from '@ovh-ux/manager-module-vcd-api';
import { vcdaMigrationMock } from './vcda.mock';

export type TVcdaMockParams = {
  vcdaMigration?: PublicVcda | null;
  isVcdaMigrationKo?: boolean;
  isVcdaUpdateKo?: boolean;
};

export const getVcdaMocks = ({
  vcdaMigration = vcdaMigrationMock,
  isVcdaMigrationKo,
  isVcdaUpdateKo,
}: TVcdaMockParams): Handler[] => [
  {
    url: '/vmwareCloudDirector/migration',
    response: () => (vcdaMigration ? [vcdaMigration] : []),
    api: 'v2',
    method: 'get',
    status: isVcdaMigrationKo ? 500 : 200,
  },
  {
    url: '/vmwareCloudDirector/migration/:migrationId',
    response: () => vcdaMigration ?? {},
    api: 'v2',
    method: 'get',
    status: isVcdaMigrationKo ? 500 : 200,
  },
  {
    url: '/vmwareCloudDirector/migration/:migrationId',
    response: () => vcdaMigration ?? {},
    api: 'v2',
    method: 'put',
    status: isVcdaUpdateKo ? 500 : 200,
  },
];
