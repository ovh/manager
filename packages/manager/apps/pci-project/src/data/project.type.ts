import { TProject } from '@ovh-ux/manager-pci-common';
import { TService } from './service.type';

export type TProjectWithService = TProject & {
  service: TService | undefined;
};

export type TProjects = TProjectWithService[];
