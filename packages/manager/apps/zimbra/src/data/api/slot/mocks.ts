import { ZimbraOffer } from '../type';
import { SlotBillingStatus, SlotType } from './type';

export const slotMock: SlotType = {
  checksum: 'string',
  currentState: {
    accountId: '196cecd6-a540-4000-804b-630eb488f080',
    billingStatus: 'CREATING',
    createdAt: '2025-05-14T12:38:10.772Z',
    email: 'string',
    offer: 'STARTER',
    platformId: '196cecd6-a540-4000-88a8-0153659b2280',
  },
  currentTasks: [
    {
      id: '196cecd6-a540-4000-89be-85d8607e6480',
      link: 'string',
      status: 'ERROR',
      type: 'string',
    },
  ],
  id: '1',
  resourceStatus: 'READY',
  targetSpec: 'string',
};

export const slotsMock: SlotType[] = [
  slotMock,
  {
    ...slotMock,
    id: '2',
    ...{
      currentState: {
        ...slotMock.currentState,
        offer: ZimbraOffer.PRO,
        billingStatus: SlotBillingStatus.OK,
      },
    },
  },
  {
    ...slotMock,
    id: '3',
    ...{
      currentState: {
        ...slotMock.currentState,
        offer: ZimbraOffer.PRO,
        billingStatus: SlotBillingStatus.SUSPENDED,
      },
    },
  },
];
