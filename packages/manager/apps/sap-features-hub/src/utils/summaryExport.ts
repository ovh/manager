import { InstallationFormValues } from '@/types/form.type';

const getSummaryJSON = (form: InstallationFormValues) => {
  return JSON.stringify({
    applicationServers: {}, // step not developed yet
    applicationType: form.applicationType,
    applicationVersion: form.applicationVersion,
    bucketBackint: {
      accessKey: form.bucketBackint?.accessKey,
      endpoint: form.bucketBackint?.endpoint,
      id: form.bucketBackint?.id,
      secretKey: '',
    },
    bucketSources: {
      accessKey: form.accessKey,
      endpoint: form.endpoint,
      id: form.bucketId,
      secretKey: '',
    },
    clusterName: form.clusterName,
    deploymentType: form.deploymentType,
    domainName: form.domainName,
    firewall: {
      applicationServers: form.firewallServer,
      centralServices: form.firewallService,
      hanaDatabase: form.firewallDatabase,
    },
    hanaServers: [], // step not developed yet
    logsDataPlatform: {
      certificate: '',
      entrypoint: form.logsDataPlatform?.entrypoint,
    },
    osLicense: form.osLicense,
    osUpdate: form.osUpdate,
    passwords: {
      masterSap: '',
      masterSapHana: '',
      sidadm: '',
      system: '',
    },
    sids: {
      sapHanaSid: form.sapHanaSid,
      sapSid: form.sapSid,
    },
    systemUsage: 'custom',
    vdcId: form.datacenterId,
  });
};

export const getSummaryFileName = (sapSid: string) =>
  `my-sap-installation-${sapSid || 'sapSid'}`;

export const getSummaryBlob = (form: InstallationFormValues) =>
  new Blob([getSummaryJSON(form)], { type: 'application/json' });
