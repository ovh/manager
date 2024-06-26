import { PciProject, PciProjectPlanCode } from '../data/api/api.type';

export const pciProjectMocked: PciProject = {
  serviceId: 89098,
  project_id: '1234',
  projectName: 'projectName',
  description: 'Test Project',
  planCode: PciProjectPlanCode.STANDARD,
  access: 'full',
  creationDate: '2021-05-07T14:16:34.416102+02:00',
  unleash: true,
  status: 'ok',
};
