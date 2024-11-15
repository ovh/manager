import { VCDOrganization } from '@ovh-ux/manager-module-vcd-api';

export const organizationList: VCDOrganization[] = [
  {
    currentState: {
      apiUrl: 'https://vcd.my.company',
      billingType: 'MONTHLY',
      description: 'Company VCD Organization',
      fullName: 'Company VCD',
      region: 'EU-CENTRAL-WAW',
      name: 'org-eu-central-waw-6cfa2c69-c62c-4853-80ee-c9682e6727f0',
      spla: false,
      webInterfaceUrl: 'https://vcd.my.company',
    },
    currentTasks: [
      {
        id: '1fda9001-a48b-4022-a656-ac295d363470',
        link:
          '/v2/vmwareCloudDirector/organization/6cfa2c69-c62c-4853-80ee-c9682e6727f0/task/1fda9001-a48b-4022-a656-ac295d363470',
        status: 'PENDING',
        type: 'VCD_UPDATE',
      },
    ],
    iam: {
      id: 'org1',
      urn: 'urn:org1',
    },
    id: 'org-eu-central-waw-6cfa2c69-c62c-4853-80ee-c9682e6727f0',
    resourceStatus: 'UPDATING',
    targetSpec: {
      description: 'Company production VCD Organization',
      fullName: 'Company VCD',
    },
    updatedAt: '2024-06-14T09:21:21.943Z',
  },
  {
    currentState: {
      apiUrl: 'https://vcd.my.demo.lab',
      billingType: 'DEMO',
      description: 'My demo VCD Organization',
      fullName: 'Demo VCD',
      region: 'CA-EAST-BHS',
      name: 'org-ca-east-bhs-61ebdcec-0623-4a61-834f-a1719cd475b4',
      spla: true,
      webInterfaceUrl: 'https://vcd.my.second.lab',
    },
    iam: {
      id: 'org2',
      urn: 'urn:org2',
    },
    currentTasks: [],
    id: 'org-ca-east-bhs-61ebdcec-0623-4a61-834f-a1719cd475b4',
    resourceStatus: 'READY',
    targetSpec: {
      description: 'My demo VCD Organization',
      fullName: 'Demo VCD',
    },
    updatedAt: '2024-06-14T09:21:21.943Z',
  },
  {
    currentState: {
      apiUrl: 'https://vcd.demo.lab',
      billingType: 'DEMO',
      description: 'My VCD Organization',
      fullName: 'Company VCD C',
      region: 'CA-EAST-BHS',
      name: 'org-ca-east-bhs-70ebdcec-0623-4a61-834f-a1719cd475b4',
      spla: true,
      webInterfaceUrl: 'https://vcd.my.third.lab',
    },
    iam: {
      id: 'org3',
      urn: 'urn:org3',
    },
    currentTasks: [],
    id: 'org-ca-east-bhs-70ebdcec-0623-4a61-834f-a1719cd475b4',
    resourceStatus: 'READY',
    targetSpec: {
      description: 'My VCD Organization',
      fullName: 'Company VCD C',
    },
    updatedAt: '2024-06-14T09:21:21.943Z',
  },
];
