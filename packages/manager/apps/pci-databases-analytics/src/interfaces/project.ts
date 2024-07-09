export enum PciProjectPlanCode {
  DISCOVERY = 'project.discovery',
  STANDARD = 'project.2018',
}
export interface PciProject {
  access: string;
  creationDate: string;
  description: string;
  projectName: string;
  project_id: string;
  status: string;
  unleash: boolean;
  planCode: PciProjectPlanCode;
}
