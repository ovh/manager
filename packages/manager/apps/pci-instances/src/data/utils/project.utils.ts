import { TProject } from '@ovh-ux/manager-pci-common';

export enum PlanCode {
  DISCOVERY = 'project.discovery',
  STANDARD = 'project.2018',
}

export const isDiscoveryProject = (project: TProject | undefined): boolean => {
  return project?.planCode === PlanCode.DISCOVERY;
};
