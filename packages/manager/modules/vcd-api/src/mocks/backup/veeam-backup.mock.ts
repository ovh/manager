import { VeeamBackupWithIam } from '../../vcd.type';

export const backupList: VeeamBackupWithIam[] = [
  {
    id: '6cfa2c69-c62c-4853-80ee-c9682e6727f0-veeam-backup',
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
      azName: 'eu-central-waw-a',
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
  {
    id: '61ebdcec-0623-4a61-834f-a1719cd475b4-veeam-backup',
    iam: {
      displayName: 'Company B backup service',
      id: 'e8aa91fb-e0bb-435f-b324-db0434dd2737',
      urn: 'urn:v1:resource:vmwareCloudDirectorBackup:BackupB',
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
      azName: 'ca-east-bhs-a',
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
  {
    id: '70ebdcec-0623-4a61-834f-a1719cd475b4-veeam-backup',
    iam: {
      displayName: 'Company C backup service',
      id: 'd8aa91fb-e0bb-435f-b324-db0434dd2737',
      urn: 'urn:v1:resource:vmwareCloudDirectorBackup:BackupC',
    },
    currentState: {
      offers: [
        {
          name: 'BRONZE',
          quotaInTB: 100,
          usedSpaceInGB: 1000,
          status: 'READY',
        },
        {
          name: 'SILVER',
          quotaInTB: 100,
          usedSpaceInGB: 1000,
          status: 'READY',
        },
      ],
      azName: 'ca-east-bhs-a',
    },
    updatedAt: '2024-06-14T09:21:21.943Z',
    createdAt: '2024-06-14T09:21:21.943Z',
    resourceStatus: 'DISABLED',
    targetSpec: {
      offers: [
        {
          name: 'BRONZE',
          quotaInTB: 1000,
          status: 'READY',
        },
        {
          name: 'SILVER',
          quotaInTB: 1000,
          status: 'READY',
        },
      ],
    },
  },
];
