import { PciProject, PciProjectPlanCode } from '@/models/project';

export const mockedPciProject: PciProject = {
  access: 'access',
  creationDate: 'creationDate',
  description: 'description',
  projectName: 'projectName',
  project_id: 'projectId',
  status: 'status',
  unleash: true,
  planCode: PciProjectPlanCode.STANDARD,
};
