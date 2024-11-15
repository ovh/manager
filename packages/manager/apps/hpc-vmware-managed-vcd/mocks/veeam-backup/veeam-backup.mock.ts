import { VCDOrganizationBackup } from '@ovh-ux/manager-module-vcd-api';
import { organizationList } from '../vcd-organization/vcd-organization.mock';

export const backupList: VCDOrganizationBackup[] = [
  {
    id: `${organizationList[0].id}-veeam-backup`,
    iam: {
      displayName: 'Company A backup service',
      id: 'daf6f34e-4b19-11ef-97b7-0050568ce122',
      urn: 'urn:v1:resource:vmwareCloudDirectorBackup:BackupA',
    },
    currentState: {
      offers: [
        {
          name: 'BRONZE',
          quotaInTB: 100,
          usedSpaceInGB: 50,
          status: 'READY',
        },
        {
          name: 'SILVER',
          quotaInTB: 100,
          usedSpaceInGB: 50,
          status: 'READY',
        },
      ],
      region: 'CA-EAST-BHS',
    },
    updatedAt: '2024-06-14T09:21:21.943Z',
    createdAt: '2024-06-14T09:21:21.943Z',
    resourceStatus: 'READY',
    targetSpec: {
      offers: [
        {
          name: 'BRONZE',
          quotaInTB: 100,
          status: 'READY',
        },
        {
          name: 'SILVER',
          quotaInTB: 100,
          status: 'READY',
        },
      ],
    },
  },
];
