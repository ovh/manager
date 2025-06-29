import {
  InstallationFormValues,
  StructuredInstallationForm,
  EnablementForm,
  InitializationForm,
  DeploymentForm,
  OSConfigForm,
  ServerConfigForm,
  SystemForm,
} from '@/types/form.type';
import { serverMappers } from './serverMappers';

export const mapFormEnablementToStructured = (form: EnablementForm) => ({
  bucketBackint: form.bucketBackint ? { ...form.bucketBackint } : undefined,
  logsDataPlatform: form.logsDataPlatform
    ? { ...form.logsDataPlatform }
    : undefined,
});

export const mapFormInitialToStructured = (form: InitializationForm) => ({
  serviceName: form.serviceName,
  vdcId: form.datacenterId.toString(),
  clusterName: form.clusterName,
});

export const mapFormDeploymentToStructured = (form: DeploymentForm) => ({
  applicationType: form.applicationType,
  applicationVersion: form.applicationVersion,
  deploymentType: form.deploymentType,
});

export const mapFormServerConfigToStructured = (form: ServerConfigForm) => ({
  applicationServers: serverMappers.toExport({ form, type: 'application' }),
  hanaServers: serverMappers.toExport({ form, type: 'hana' }),
});

export const mapFormOSConfigToStructured = (form: OSConfigForm) => ({
  firewall: {
    applicationServers: form.firewallServer,
    centralServices: form.firewallService,
    hanaDatabase: form.firewallDatabase,
  },
  domainName: form.domainName,
  osLicense: form.osLicense || undefined,
  osUpdate: form.osUpdate,
});

export const mapFormSystemInformationToStructured = (form: SystemForm) => ({
  passwords: {
    masterSap: form.masterSapPassword,
    masterSapHana: form.masterSapHanaPassword,
    sidadm: form.sidadmPassword,
    system: form.systemPassword,
  },
  sids: {
    sapHanaSid: form.sapHanaSid,
    sapSid: form.sapSid,
  },
});

export const mapFormSourceInformationToStructured = (
  form: Pick<
    InstallationFormValues,
    'accessKey' | 'endpoint' | 'bucketId' | 'secretKey'
  >,
) => ({
  bucketSources: {
    accessKey: form.accessKey,
    endpoint: form.endpoint,
    id: form.bucketId,
    secretKey: form.secretKey,
  },
});

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
  datacenterId: Number(form.vdcId),
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
