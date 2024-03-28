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
};

export const getVracMocks = ({
  nbVrack = 5,
}: GetVrackMocksParams): Handler[] => [
  {
    url: '/vrack',
    response: vrackList.slice(0, nbVrack),
    api: 'v6',
  },
  {
    url: '/vrack/:id',
    response: vrackDetails,
    api: 'v6',
  },
];
