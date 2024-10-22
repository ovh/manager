import IVcdDatacentre from '../../src/types/vcd-datacenter.interface';

export const datacentreList: IVcdDatacentre[] = [
  {
    id: 'vdc-eu-central-waw-adc311b5-0c0b-4071-b48f-b20813868bcf',
    resourceStatus: 'READY',
    currentState: {
      commercialRange: 'STANDARD',
      description: 'VDC Description',
      ipQuota: 10,
      memoryQuota: 64,
      name: 'vdc-eu-central-waw-adc311b5-0c0b-4071-b48f-b20813868bcf',
      region: 'EU-CENTRAL-WAW',
      storageQuota: 1,
      vCPUCount: 16,
      vCPUSpeed: 3,
    },
    currentTasks: [],
    targetSpec: {
      description: 'VDC Description',
      vCPUSpeed: 3,
    },
    updatedAt: '2024-09-23T13:53:49Z',
    iam: {
      id: '33dda1c2-b24e-4db2-b7f3-4f3a8e08d68f',
      urn:
        'urn:v1:eu:resource:vmwareCloudDirector:org-eu-central-waw-366861de-e0e4-4ad5-a4c5-e9f80d744142/virtualDataCenter/vdc-eu-central-waw-adc311b5-0c0b-4071-b48f-b20813868bcf',
    },
  },
];
