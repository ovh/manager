import { InstallationFormValues } from '@/types/form.type';

export const getSummaryJSON = (form: InstallationFormValues) => {
  return JSON.stringify({
    applicationServers: [{}], // step not developed yet
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
    hanaServers: [{}], // step not developed yet
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
