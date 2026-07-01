import { organizationList, PublicVcda } from '@ovh-ux/manager-module-vcd-api';

export const DEFAULT_ORGANIZATION_ID = organizationList[0].id;

export const vcdaMigrationMock: PublicVcda = {
  id: 'migration-1',
  resourceStatus: 'READY',
  currentState: {
    organizationId: DEFAULT_ORGANIZATION_ID,
    migrationCloudUrl: 'https://migration.eu-west-par.vcda.ovh.net',
    ips: ['192.168.1.10', '10.0.0.5'],
  },
  currentTasks: [],
  targetSpec: { ips: ['192.168.1.10', '10.0.0.5'] },
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
};
