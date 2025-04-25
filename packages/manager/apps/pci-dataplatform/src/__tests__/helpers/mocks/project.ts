import { AccessTypeEnum } from '@datatr-ux/ovhcloud-types/cloud/AccessTypeEnum';
import { PlanCode, Project } from '@/types/cloud/Project';
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
  planCode: PlanCode.STANDARD,
};

export const mockedPciDiscoveryProject: Project = {
  access: AccessTypeEnum.full,
  creationDate: 'creationDate',
  manualQuota: false,
  description: 'description',
  projectName: 'projectName',
  project_id: 'projectId',
  status: ProjectStatusEnum.ok,
  unleash: true,
  planCode: PlanCode.DISCOVERY,
};
