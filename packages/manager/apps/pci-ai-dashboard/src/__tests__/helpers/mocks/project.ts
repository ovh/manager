import { AccessTypeEnum } from '@/types/cloud/AccessTypeEnum';
import { Project } from '@/types/cloud/Project';
import { ProjectStatusEnum } from '@/types/cloud/project/ProjectStatusEnum';

export const mockedPciProject: Project = {
  access: AccessTypeEnum.full,
  creationDate: 'creationDate',
  manualQuota: false,
  description: 'description',
  projectName: 'projectName',
  project_id: 'projectId',
  status: ProjectStatusEnum.ok,
  unleash: true,
  planCode: 'project.2018',
};

/*
export enum PciProjectPlanCode {
  DISCOVERY = 'project.discovery',
  STANDARD = 'project.2018',
}
*/
