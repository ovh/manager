import {
  InstallationFormErrors,
  InstallationFormValues,
} from '@/types/form.type';

export const installationInitialValues: InstallationFormValues = {
  serviceName: '',
  serviceDisplayName: '',
  datacenterId: null,
  datacenterName: '',
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
  bucketId: '',
  endpoint: '',
  accessKey: '',
  secretKey: '',
  domainName: '',
  osLicense: '',
  osUpdate: false,
  firewallService: false,
  firewallServer: false,
  firewallDatabase: false,
  bucketBackint: undefined,
  logsDataPlatform: undefined,
} as const;

export const installationInitialErrors: InstallationFormErrors = Object.keys(
  installationInitialValues,
).reduce(
  (errors, key: keyof InstallationFormErrors) => ({ ...errors, [key]: '' }),
  {} as InstallationFormErrors,
);
