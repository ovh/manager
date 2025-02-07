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
