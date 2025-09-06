import { Service, ServicePlanEnum, ServiceStateEnum } from '../types/dbaas/logs';

export const logServicesMock: Service[] = [
  {
    createdAt: '2019-10-22T16:40:54.418224+02:00',
    displayName: undefined,
    isClusterOwner: false,
    isIamEnabled: false,
    plan: ServicePlanEnum.STANDARD,
    serviceName: 'ldg-fr-32416',
    state: ServiceStateEnum.ENABLED,
    updatedAt: '2021-10-18T16:18:22.629504+02:00',
    username: 'logs-mdy-05884',
  },
  {
    createdAt: '2019-10-22T16:40:54.418224+02:00',
    displayName: 'Custom Name',
    isClusterOwner: false,
    isIamEnabled: false,
    plan: ServicePlanEnum.STANDARD,
    serviceName: 'ldg-fr-123123',
    state: ServiceStateEnum.ENABLED,
    updatedAt: '2021-10-18T16:18:22.629504+02:00',
    username: 'logs-mdy-123123',
  },
];
