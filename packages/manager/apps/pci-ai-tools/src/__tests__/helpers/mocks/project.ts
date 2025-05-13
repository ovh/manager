import { AccessTypeEnum } from '@datatr-ux/ovhcloud-types/cloud/AccessTypeEnum';
import { Project } from '@datatr-ux/ovhcloud-types/cloud/Project';
import { ProjectStatusEnum } from '@datatr-ux/ovhcloud-types/cloud/project/ProjectStatusEnum';

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

export const mockedPciDiscoveryProject: Project = {
  access: AccessTypeEnum.full,
  creationDate: 'creationDate',
  manualQuota: false,
  description: 'description',
  projectName: 'projectName',
  project_id: 'projectId',
  status: ProjectStatusEnum.ok,
  unleash: true,
  planCode: 'project.discovery',
};
