import {
  InstallationFormValues,
  StructuredInstallationForm,
} from '@/types/form.type';
import { serverMappers } from './serverMappers';

const mapFormToStructured = (
  form: InstallationFormValues,
): StructuredInstallationForm => ({
  applicationServers: serverMappers.toExport({ form, type: 'application' }),
  applicationType: form.applicationType,
  applicationVersion: form.applicationVersion,
  bucketBackint: form.bucketBackint ? { ...form.bucketBackint } : undefined,
  bucketSources: {
    accessKey: form.accessKey,
    endpoint: form.endpoint,
    id: form.bucketId,
    secretKey: form.secretKey,
  },
  clusterName: form.clusterName,
  deploymentType: form.deploymentType,
  domainName: form.domainName,
  firewall: {
    applicationServers: form.firewallServer,
    centralServices: form.firewallService,
    hanaDatabase: form.firewallDatabase,
  },
  hanaServers: serverMappers.toExport({ form, type: 'hana' }),
  logsDataPlatform: form.logsDataPlatform
    ? { ...form.logsDataPlatform }
    : undefined,
  osLicense: form.osLicense || undefined,
  osUpdate: form.osUpdate,
  passwords: {
    masterSap: form.masterSapPassword,
    masterSapHana: form.masterSapHanaPassword,
    sidadm: form.sidadmPassword,
    system: form.systemPassword,
  },
  serviceName: form.serviceName,
  sids: {
    sapHanaSid: form.sapHanaSid,
    sapSid: form.sapSid,
  },
  systemUsage: 'custom',
  vdcId: form.datacenterId,
});

const mapStructuredToForm = (
  form: StructuredInstallationForm,
): InstallationFormValues => ({
  serviceName: form.serviceName,
  serviceDisplayName: '',
  datacenterId: form.vdcId,
  datacenterName: '',
  clusterName: form.clusterName,
  clusterId: null,
  applicationVersion: form.applicationVersion,
  applicationType: form.applicationType,
  deploymentType: form.deploymentType,
  sapSid: form.sids.sapSid,
  sapHanaSid: form.sids.sapHanaSid,
  masterSapPassword: form.passwords.masterSap,
  masterSapHanaPassword: form.passwords.masterSapHana,
  sidadmPassword: form.passwords.sidadm,
  systemPassword: form.passwords.system,
  bucketId: form.bucketSources.id,
  endpoint: form.bucketSources.endpoint,
  accessKey: form.bucketSources.accessKey,
  secretKey: form.bucketSources.secretKey,
  domainName: form.domainName,
  osLicense: form.osLicense,
  osUpdate: form.osUpdate,
  firewallService: form.firewall.centralServices,
  firewallServer: form.firewall.applicationServers,
  firewallDatabase: form.firewall.hanaDatabase,
  network: form.hanaServers[0]?.network,
  netmask: form.hanaServers[0]?.netmask,
  gateway: form.hanaServers[0]?.gateway,
  passwordCrypted: form.hanaServers[0]?.passwordCrypted,
  thickDatastorePolicy: form.hanaServers[0]?.thickDatastorePolicy,
  hanaServerOva: form.hanaServers[0]?.ovaTemplate,
  hanaServerDatastore: form.hanaServers[0]?.datastoreName,
  applicationServerOva: form.applicationServers[0]?.ovaTemplate,
  applicationServerDatastore: form.applicationServers[0]?.datastoreName,
  hanaServers: serverMappers.toBase({ form, type: 'hana' }),
  applicationServers: serverMappers.toBase({ form, type: 'application' }),
  bucketBackint: form.bucketBackint,
  logsDataPlatform: form.logsDataPlatform,
});

export const formMappers = {
  toStructured: mapFormToStructured,
  toFlat: mapStructuredToForm,
};
