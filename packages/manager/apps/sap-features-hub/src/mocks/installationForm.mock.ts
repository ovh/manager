import { InstallationFormValues } from '@/types/form.type';
import {
  installationInitialValues,
  installationInitialErrors,
} from '@/context/installationInitialValues.constants';

export const mockedValues: InstallationFormValues = {
  ...installationInitialValues,
  sapSid: 'sapSid',
  sapHanaSid: 'sapHanaSid',
  masterSapPassword: 'masterSapPassword',
  masterSapHanaPassword: 'masterSapHanaPassword',
  sidamnPassword: 'sidamnPassword',
  systemPassword: 'systemPassword',
  bucketId: 'bucketId',
  endpoint: 'endpoint',
  accessKey: 'accessKey',
  secretKey: 'secretKey',
  domainName: 'domainName',
  osLicense: 'osLicense',
  osUpdate: true,
  firewallService: true,
  firewallServer: false,
  firewallDatabase: false,
};

export const mockedErrors = {
  ...installationInitialErrors,
  sapSid: '',
  sapHanaSid: 'sapHanaSid is not valid',
  masterSapPassword: '',
  masterSapHanaPassword: 'masterSapHanaPassword is not valid',
  sidamnPassword: 'sidamnPassword is not valid',
  systemPassword: 'systemPassword is not valid',
  bucketId: '',
  endpoint: 'endpoint format is not valid',
  accessKey: 'accessKey format is not valid',
  secretKey: 'secretKey format is not valid',
  domainName: '',
  osLicense: 'osLicense format is not valid',
};
