import { IamObject } from '@ovh-ux/manager-react-components';

export interface IVcdOrganizationState {
  fullName: string;
  description: string;
}

export interface IVcdOrganizationCurrentState extends IVcdOrganizationState {
  apiUrl?: string;
  region: string;
  name: string;
  spla: boolean;
  webInterfaceUrl: string;
}

export default interface IVcdOrganization {
  id: string;
  resourceStatus: string;
  currentState: IVcdOrganizationCurrentState;
  targetSpec: IVcdOrganizationState;
  currentTasks?: any[];
  iam: IamObject;
}
