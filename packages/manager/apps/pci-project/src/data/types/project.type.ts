import { TProject, TProjectStatus } from '@ovh-ux/manager-pci-common';
import { TService } from './service.type';

export type TAggregatedStatus = TProjectStatus | 'unpaid';

export type TProjectWithService = TProject & {
  service: TService;
  isDefault: boolean;
  isUnpaid: boolean;
  aggregatedStatus: TAggregatedStatus;
};

export type TProjects = TProjectWithService[];
