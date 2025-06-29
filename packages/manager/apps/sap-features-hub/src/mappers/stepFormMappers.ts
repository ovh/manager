import {
  EnablementForm,
  InitializationForm,
  DeploymentForm,
  ServerConfigForm,
  OSConfigForm,
  SystemForm,
  InstallationFormValues,
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
  datacenterId: form.datacenterId,
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
