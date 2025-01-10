import { InstallationForm } from '@/types/form.type';

export const installationInitialValues: InstallationForm = {
  serviceName: '',
  datacenterId: null,
  clusterName: '',
  applicationVersion: '',
  applicationType: '',
  deploymentType: '',
  sapSid: '',
  sapHanaSid: '',
  masterSapPassword: '',
  masterSapHanaPassword: '',
  sidamnPassword: '',
  systemPassword: '',
} as const;
