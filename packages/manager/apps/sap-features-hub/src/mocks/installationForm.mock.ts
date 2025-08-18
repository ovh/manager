import { InstallationFormValues } from '@/types/form.type';
import { installationInitialErrors } from '@/context/installationInitialValues.constants';
import {
  DEFAULT_APPLICATION_SERVER,
  DEFAULT_HANA_SERVER,
} from '@/utils/defaultServers.constants';
import { formMappers } from '@/mappers/formMappers';

export const mockedValues: InstallationFormValues = {
  serviceName: 'pcc-145-239-132-226',
  serviceDisplayName: 'PRE48 NSX',
  datacenterId: 869,
  datacenterName: 'datacenter869GG',
  clusterName: 'Cluster1',
  clusterId: 1006,
  applicationVersion: 'S/4HANA 2023',
  applicationType: 'JAVA',
  deploymentType: 'Standard',
  sapSid: 'SAP',
  sapHanaSid: 'HAN',
  masterSapPassword: 'PasswordMaster1!',
  masterSapHanaPassword: 'PasswordHana1!',
  sidadmPassword: 'PasswordSidadm1!',
  systemPassword: 'PasswordSystem1!',
  bucketId: 'bucketContainerId',
  endpoint: 'https://bucket.endpoint.ok',
  accessKey: 'bucketAccessKeyzzzzzzzzzzzzzzzzz',
  secretKey: 'bucketSecretKeyzzzzzzzzzzzzzzzzz',
  domainName: 'osconfig.domain',
  osLicense: 'osconfigLicenseSuse',
  osUpdate: true,
  firewallService: true,
  firewallServer: false,
  firewallDatabase: false,
  network: 'network',
  netmask: '1.1.1.1',
  gateway: '3.3.3.3',
  thickDatastorePolicy: 'storePolicy',
  hanaServerOva: 'hanaOva',
  hanaServerDatastore: 'hanaStore',
  applicationServerOva: 'appOva',
  applicationServerDatastore: 'appStore',
  hanaServers: [DEFAULT_HANA_SERVER],
  applicationServers: [DEFAULT_APPLICATION_SERVER],
  bucketBackint: {
    id: 'backintContainerId',
    endpoint: 'https://backint.endpoint.ok',
    accessKey: 'backintAccessKeyzzzzzzzzzzzzzzzz',
    secretKey: 'backintSecretKeyzzzzzzzzzzzzzzzz',
  },
  logsDataPlatform: {
    entrypoint: 'https://logstashentrypoint.logs.ovh.com',
    certificate: 'certificate',
  },
};

export const mockedErrors = {
  ...installationInitialErrors,
  sapSid: '',
  sapHanaSid: 'sapHanaSid is not valid',
  masterSapPassword: '',
  masterSapHanaPassword: 'masterSapHanaPassword is not valid',
  sidadmPassword: 'sidadmPassword is not valid',
  systemPassword: 'systemPassword is not valid',
  bucketId: '',
  endpoint: 'endpoint format is not valid',
  accessKey: 'accessKey format is not valid',
  secretKey: 'secretKey format is not valid',
  domainName: '',
  osLicense: 'osLicense format is not valid',
};

export const mockedStructuredForm = formMappers.toStructured(mockedValues);

export const mockedJSONSummary = JSON.stringify(mockedStructuredForm);
