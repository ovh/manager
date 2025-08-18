import {
  InstallationFormValues,
  StructuredInstallationForm,
} from '@/types/form.type';
import { serverMappers } from './serverMappers';
import {
  mapFormInitialToStructured,
  mapFormEnablementToStructured,
  mapFormDeploymentToStructured,
  mapFormServerConfigToStructured,
  mapFormOSConfigToStructured,
  mapFormSystemInformationToStructured,
  mapFormSourceInformationToStructured,
} from './stepFormMappers';

const mapFormToStructured = (
  form: InstallationFormValues,
): StructuredInstallationForm => ({
  ...mapFormInitialToStructured(form),
  ...mapFormEnablementToStructured(form),
  ...mapFormDeploymentToStructured(form),
  ...mapFormServerConfigToStructured(form),
  ...mapFormOSConfigToStructured(form),
  ...mapFormSystemInformationToStructured(form),
  ...mapFormSourceInformationToStructured(form),
  systemUsage: 'custom',
});

const mapStructuredToForm = (
  form: StructuredInstallationForm,
): InstallationFormValues => ({
  serviceName: form.serviceName,
  serviceDisplayName: '',
  datacenterId: form.datacenterId,
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
