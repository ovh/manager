import { KMSServiceInfos, OkmsState } from '@/types/okmsService.type';
import { Handler } from '../../../../../../playwright-helpers';

const serviceList: KMSServiceInfos[] = [
  {
    billing: {
      lifecycle: { current: { creationDate: '2024-04-12T18:00:00.000Z' } },
      nextBillingDate: '2024-05-12T18:00:00.000Z',
    },
    customer: { contacts: [{ customerCode: 'code', type: 'type' }] },
    resource: {
      displayName: 'name',
      name: 'name',
      product: { name: 'name', description: 'descripton' },
      resellingProvider: 'test',
      state: OkmsState.Active,
    },
  },
];

export const getServicesMocks = (): Handler[] => [
  {
    url: '/services/:id',
    response: serviceList[0],
    status: 200,
    method: 'get',
    api: 'v6',
  },
  {
    url: '/services',
    response: () => [1234567890],
    status: 200,
    method: 'get',
    api: 'v6',
  },
];
