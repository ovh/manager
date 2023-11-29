import { ResponseData, Status } from '../../src/api/api.type';
import { Handler } from '../../../../../super-components/_common/msw-helpers';
import {
  VrackServices,
  ProductStatus,
  ResourceStatus,
  UpdateVrackServicesParams,
} from '../../src/api/vrack-services/vrack-services.type';

export const vrackServicesList: VrackServices[] = [
  {
    checksum: 'd41d8cd98f00b204e9800998ecf8427e',
    createdAt: '2023-03-10T12:00:00Z',
    currentState: {
      displayName: null,
      productStatus: ProductStatus.DRAFT,
      subnets: [],
      vrackId: null,
      zone: 'LIM',
    },
    currentTasks: [],
    id: 'vrs-ahc-fw4-od1-efq',
    resourceStatus: ResourceStatus.READY,
    targetSpec: {
      displayName: null,
      subnets: [],
    },
    updatedAt: '2023-03-10T12:00:00Z',
  },
  {
    checksum: '4c5d68ea2231e90db7495406018a0f5e',
    createdAt: '2023-03-10T10:00:00Z',
    currentState: {
      displayName: 'My.vRack.Services',
      productStatus: ProductStatus.DRAFT,
      subnets: [
        {
          cidr: '192.168.0.0/16',
          displayName: 'My.Subnet',
          serviceEndpoints: [
            {
              endpoints: [
                {
                  description: 'Nominal',
                  ip: '192.168.0.5',
                },
              ],
              managedServiceURN:
                'urn:v1:eu:resource:storageNetApp:examples-00e1-4a3d-ae89-ac145675c8bb',
            },
            {
              endpoints: [
                {
                  description: '',
                  ip: '192.168.0.2',
                },
              ],
              managedServiceURN:
                'urn:v1:eu:resource:storageNetApp:examples-a77c-478e-93ce-06aa94cbd9d1',
            },
          ],
          serviceRange: {
            cidr: '192.168.0.0/29',
            remainingIps: 1,
            reservedIps: 5,
            usedIps: 2,
          },
          vlan: 30,
        },
      ],
      vrackId: null,
      zone: 'GRA',
    },
    currentTasks: [],
    id: 'vrs-ar7-72w-poh-3qe',
    resourceStatus: ResourceStatus.READY,
    targetSpec: {
      displayName: 'My.vRack.Services',
      subnets: [
        {
          cidr: '192.168.0.0/16',
          displayName: 'My.Subnet',
          serviceEndpoints: [
            {
              managedServiceURN:
                'urn:v1:eu:resource:storageNetApp:examples-00e1-4a3d-ae89-ac145675c8bb',
            },
            {
              managedServiceURN:
                'urn:v1:eu:resource:storageNetApp:examples-a77c-478e-93ce-06aa94cbd9d1',
            },
          ],
          serviceRange: {
            cidr: '192.168.0.0/29',
          },
          vlan: 30,
        },
      ],
    },
    updatedAt: '2023-03-10T10:10:00Z',
  },
  {
    checksum: 'fdd6a7a50286fd969102e319ef6b8545',
    createdAt: '2023-03-10T07:00:00Z',
    currentState: {
      displayName: 'My-vRack-Services-in-error',
      productStatus: ProductStatus.DRAFT,
      subnets: [],
      vrackId: null,
      zone: 'RBX',
    },
    currentTasks: [
      {
        createdAt: '2023-03-10T08:00:00Z',
        id: 'ope-a4i-a5y-dof-pt7',
        link: '/v2/vrackServices/resource/vrs-asp-dtl-lym-wza',
        status: Status.ERROR,
        type: 'VrackServicesUpdate',
        progress: [],
      },
    ],
    id: 'vrs-asp-dtl-lym-wza',
    resourceStatus: ResourceStatus.ERROR,
    targetSpec: {
      displayName: 'My-vRack-Services-in-error',
      subnets: [
        {
          cidr: '172.21.0.0/16',
          serviceEndpoints: [],
          serviceRange: {
            cidr: '172.21.0.0/29',
          },
          vlan: null,
        },
      ],
    },
    updatedAt: '2023-03-10T07:10:00Z',
  },
  {
    checksum: '003df9f0d644a36164a7de26ab20bf6c',
    createdAt: '2023-03-10T09:00:00Z',
    currentState: {
      displayName: 'MyVrackServices',
      productStatus: ProductStatus.DRAFT,
      subnets: [],
      vrackId: null,
      zone: 'RBX',
    },
    currentTasks: [
      {
        id: 'ope-a1k-xn5-4gi-b0j',
        link: '/v2/vrackServices/resource/vrs-ahz-9t0-7lb-b5l',
        status: Status.RUNNING,
        type: 'VrackServicesUpdate',
        progress: [],
        createdAt: '2023-03-10T19:10:00Z',
      },
    ],
    id: 'vrs-ahz-9t0-7lb-b5l',
    resourceStatus: ResourceStatus.UPDATING,
    targetSpec: {
      displayName: 'My_Vrack_Services',
      subnets: [
        {
          cidr: '172.21.0.0/16',
          serviceEndpoints: [],
          serviceRange: {
            cidr: '172.21.0.0/29',
          },
          vlan: null,
        },
      ],
    },
    updatedAt: '2023-03-10T09:10:00Z',
  },
];

export type GetVrackServicesMocksParams = {
  nbVs?: number;
  updateKo?: boolean;
};

export const getVrackServicesMocks = ({
  nbVs = 0,
  updateKo,
}: GetVrackServicesMocksParams): Handler[] => [
  {
    url: '/vrackServices/resource',
    response: vrackServicesList.slice(0, nbVs),
    api: 'v2',
  },
  {
    url: '/vrackServices/resource/:id',
    response: ({ params }: { params: { id: string } }) =>
      vrackServicesList.find(({ id }) => id === params.id),
    api: 'v2',
  },
  {
    url: '/vrackServices/resource/:id',
    response: ({
      params,
      body,
    }: {
      params: { id: string };
      body: UpdateVrackServicesParams;
    }) => {
      if (updateKo) {
        return {
          status: 500,
          code: 'ERR_UPDATE_ERROR',
          response: {
            status: 500,
            data: {
              message: 'Update error',
            },
          },
        } as ResponseData;
      }
      const vs = vrackServicesList.find(({ id }) => id === params.id);
      vs.currentState.displayName = body.targetSpec.displayName;
      vs.currentState.subnets = body.targetSpec.subnets;
      return vs;
    },
    status: updateKo ? 500 : 200,
    method: 'put',
    api: 'v2',
  },
];
