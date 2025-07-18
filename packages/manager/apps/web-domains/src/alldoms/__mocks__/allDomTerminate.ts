import { TServiceInfo } from '@/alldoms/types';
import { LifecycleActionsEnum } from '../enum/service.enum';

export const allDomTerminate: TServiceInfo[] = [
  {
    billing: {
      expirationDate: '2025-10-10T16:48:29Z',
      lifecycle: {
        current: {
          pendingActions: [LifecycleActionsEnum.EarlyRenewal],
          creationDate: '2024-10-10T16:48:29Z',
        },
      },
    },
    serviceId: 128473986,
    resource: {
      name: 'test-domain.fr',
    },
  },
];
