import { IamObject } from '@ovh-ux/manager-react-components';
import { DeploymentType } from './sapCapabilities.type';

export type TSAPInstallation = {
  startTime: string;
  serviceName: string;
  sapHanaSid: string;
  sapSid: string;
  applicationVersion: string;
  applicationType: string;
  deploymentType: string;
  status: SAPInstallationStatus;
};

export enum SAPInstallationStatus {
  failure = 'FAILURE',
  pending = 'PENDING',
  retry = 'RETRY',
  revoked = 'REVOKED',
  started = 'STARTED',
  success = 'SUCCESS',
}

export type InstallationDetails = {
  ansibleSapHanaStatus: SAPInstallationStatus;
  ansibleSapSystemStatus: SAPInstallationStatus;
  applicationType: 'ABAP' | 'JAVA';
  applicationVersion: string;
  cleanStatus: SAPInstallationStatus;
  deploymentType: DeploymentType;
  endTime: string | null;
  errorMessage: string | null;
  gatewayStatus: SAPInstallationStatus;
  iam: IamObject;
  sapHanaSid: string;
  sapSid: string;
  startTime: string;
  status: SAPInstallationStatus;
  taskId: string;
  terraformStatus: SAPInstallationStatus;
};
