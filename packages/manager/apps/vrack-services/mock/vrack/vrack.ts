import { Handler } from '@playwright-helpers';

export const vrackList = [
  'pn-00001',
  'pn-00002',
  'pn-00003',
  'pn-00004',
  'pn-00005',
];

const vrackDetails = {
  name: '',
  description: '',
};

export type GetVrackMocksParams = {
  nbVrack?: number;
  dissociateKo?: boolean;
};

export const getVracMocks = ({
  nbVrack = 5,
  dissociateKo = false,
}: GetVrackMocksParams): Handler[] => [
  {
    url: '/vrack/:id/vrackServices/:vsId',
    response: dissociateKo ? { message: 'Update error' } : {},
    status: dissociateKo ? 500 : 200,
    api: 'v6',
    method: 'delete',
  },
  {
    url: '/vrack/:id',
    response: vrackDetails,
    api: 'v6',
  },
  {
    url: '/vrack',
    response: vrackList.slice(0, nbVrack),
    api: 'v6',
  },
];
