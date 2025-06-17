import { ResourceStatus, TaskStatus, ZimbraOffer } from '@/data/api';

export const SlotBillingStatus = {
  CREATING: 'CREATING',
  DELETED: 'DELETED',
  DELETING: 'DELETING',
  OK: 'OK',
  REOPENING: 'REOPENING',
  SUSPENDED: 'SUSPENDED',
  SUSPENDING: 'SUSPENDING',
  UPDATING: 'UPDATING',
} as const;

export type SlotType = {
  checksum: string;
  currentState: {
    accountId: string;
    platformId: string;
    createdAt: string;
    email: string;
    offer: keyof typeof ZimbraOffer;
    billingStatus: keyof typeof SlotBillingStatus;
  };
  currentTasks: {
    id: string;
    link: string;
    status: keyof typeof TaskStatus;
    type: string;
  }[];
  id: string;
  resourceStatus: keyof typeof ResourceStatus;
  targetSpec: string;
};
