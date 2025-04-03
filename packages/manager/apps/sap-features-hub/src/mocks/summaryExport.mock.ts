import { mockedValues as mock } from './installationForm.mock';

export const mockedJSONSummary = JSON.stringify({
  applicationServers: [{}],
  applicationType: mock.applicationType,
  applicationVersion: mock.applicationVersion,
  bucketBackint: { ...mock.bucketBackint },
  bucketSources: {
    accessKey: mock.accessKey,
    endpoint: mock.endpoint,
    id: mock.bucketId,
    secretKey: mock.secretKey,
  },
  clusterName: mock.clusterName,
  deploymentType: mock.deploymentType,
  domainName: mock.domainName,
  firewall: {
    applicationServers: mock.firewallServer,
    centralServices: mock.firewallService,
    hanaDatabase: mock.firewallDatabase,
  },
  hanaServers: [{}],
  logsDataPlatform: { ...mock.logsDataPlatform },
  osLicense: mock.osLicense,
  osUpdate: mock.osUpdate,
  passwords: {
    masterSap: mock.masterSapPassword,
    masterSapHana: mock.masterSapHanaPassword,
    sidadm: mock.sidadmPassword,
    system: mock.systemPassword,
  },
  sids: { sapHanaSid: mock.sapHanaSid, sapSid: mock.sapSid },
  systemUsage: 'custom',
  vdcId: mock.datacenterId,
});
