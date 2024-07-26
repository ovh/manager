import { AccessTypeEnum } from '@/types/cloud/AccessTypeEnum';
import { PlanCode, Project } from '@/types/cloud/Project';
import { ProjectStatusEnum } from '@/types/cloud/project/ProjectStatusEnum';

export const mockedPciProject: Project = {
  access: AccessTypeEnum.full,
  creationDate: 'creationDate',
  description: 'description',
  projectName: 'projectName',
  project_id: 'projectId',
  status: ProjectStatusEnum.ok,
  unleash: true,
  planCode: PlanCode.STANDARD,
  manualQuota: false,
};
