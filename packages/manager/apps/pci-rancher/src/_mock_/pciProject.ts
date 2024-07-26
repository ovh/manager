import { PciProject, PciProjectPlanCode } from '@/types/api.type';

export const pciProjectMocked: PciProject = {
  project_id: '1234',
  projectName: 'projectName',
  description: 'Test Project',
  planCode: PciProjectPlanCode.STANDARD,
  unleash: true,
  creationDate: '2021-05-07T14:16:34.416102+02:00',
  access: 'full',
  status: 'ok',
};
