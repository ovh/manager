import { describe, expect, it } from 'vitest';
import {
  DeploymentForm,
  EnablementForm,
  OSConfigForm,
  ServerConfigForm,
} from '@/types/form.type';
import {
  mapFormEnablementToStructured,
  mapFormInitialToStructured,
  mapFormDeploymentToStructured,
  mapFormServerConfigToStructured,
  mapFormOSConfigToStructured,
  mapFormSystemInformationToStructured,
  mapFormSourceInformationToStructured,
} from './stepFormMappers';

describe('mapFormEnablementToStructured', () => {
  it('should map EnablementForm correctly', () => {
    const form = {
      bucketBackint: { foo: 'bar' },
      logsDataPlatform: { baz: 'qux' },
    } as EnablementForm;
    const result = mapFormEnablementToStructured(form);
    expect(result).toEqual({
      bucketBackint: { foo: 'bar' },
      logsDataPlatform: { baz: 'qux' },
    });
  });

  it('should handle undefined bucketBackint and logsDataPlatform', () => {
    const form = {
      bucketBackint: undefined,
      logsDataPlatform: undefined,
    } as EnablementForm;
    const result = mapFormEnablementToStructured(form);
    expect(result).toEqual({
      bucketBackint: undefined,
      logsDataPlatform: undefined,
    });
  });
});

describe('mapFormInitialToStructured', () => {
  it('should map InitializationForm correctly', () => {
    const form = {
      serviceName: 'test-service',
      datacenterId: 123,
      clusterName: 'test-cluster',
    };
    const result = mapFormInitialToStructured(form);
    expect(result).toEqual({
      serviceName: 'test-service',
      datacenterId: 123,
      clusterName: 'test-cluster',
    });
  });
});

describe('mapFormDeploymentToStructured', () => {
  it('should map DeploymentForm correctly', () => {
    const form = {
      applicationType: 'type1',
      applicationVersion: '1.0.0',
      deploymentType: 'Distributed',
    } as DeploymentForm;
    const result = mapFormDeploymentToStructured(form);
    expect(result).toEqual({
      applicationType: 'type1',
      applicationVersion: '1.0.0',
      deploymentType: 'Distributed',
    });
  });
});

describe('mapFormServerConfigToStructured', () => {
  it('should map ServerConfigForm correctly', () => {
    const form = {
      network: '192.168.1.0/24',
      netmask: '255.255.255.0',
      gateway: '192.168.1.1',
      thickDatastorePolicy: 'policy1',
      hanaServerOva: 'hana-ova-image',
      hanaServerDatastore: '/vmfs/volumes/datastore1',
      applicationServerOva: 'app-ova-image',
      applicationServerDatastore: '/vmfs/volumes/datastore2',
      hanaServers: [
        {
          name: 'hana-server-1',
          rootPassword: 'securepassword123',
          ipAddress: '192.168.1.100',
          instanceNumber: '00',
          vcpus: 4,
          memory: 16,
        },
      ],
      applicationServers: [],
    } as ServerConfigForm;

    const result = mapFormServerConfigToStructured(form);
    expect(result).toEqual({
      applicationServers: [],
      hanaServers: [
        {
          datastoreName: '/vmfs/volumes/datastore1',
          gateway: '192.168.1.1',
          instanceNumber: '00',
          ipAddress: '192.168.1.100',
          memory: 16,
          name: 'hana-server-1',
          netmask: '255.255.255.0',
          network: '192.168.1.0/24',
          ovaTemplate: 'hana-ova-image',
          rootPassword: 'securepassword123',
          thickDatastorePolicy: 'policy1',
          vcpus: 4,
        },
      ],
    });
  });
});

describe('mapFormOSConfigToStructured', () => {
  it('should map OSConfigForm correctly', () => {
    const form = {
      firewallServer: true,
      firewallService: true,
      firewallDatabase: true,
      domainName: 'example.com',
      osLicense: 'license123',
      osUpdate: true,
    } as OSConfigForm;
    const result = mapFormOSConfigToStructured(form);
    expect(result).toEqual({
      firewall: {
        applicationServers: true,
        centralServices: true,
        hanaDatabase: true,
      },
      domainName: 'example.com',
      osLicense: 'license123',
      osUpdate: true,
    });
  });

  it('should handle optional osLicense correctly', () => {
    const form = {
      firewallServer: true,
      firewallService: true,
      firewallDatabase: true,
      domainName: 'example.com',
      osLicense: undefined as string,
      osUpdate: false,
    } as OSConfigForm;
    const result = mapFormOSConfigToStructured(form);
    expect(result).toEqual({
      firewall: {
        applicationServers: true,
        centralServices: true,
        hanaDatabase: true,
      },
      domainName: 'example.com',
      osLicense: undefined,
      osUpdate: false,
    });
  });
});

describe('mapFormSystemInformationToStructured', () => {
  it('should map SystemForm correctly', () => {
    const form = {
      masterSapPassword: 'password1',
      masterSapHanaPassword: 'password2',
      sidadmPassword: 'password3',
      systemPassword: 'password4',
      sapHanaSid: 'sid1',
      sapSid: 'sid2',
    };
    const result = mapFormSystemInformationToStructured(form);
    expect(result).toEqual({
      passwords: {
        masterSap: 'password1',
        masterSapHana: 'password2',
        sidadm: 'password3',
        system: 'password4',
      },
      sids: {
        sapHanaSid: 'sid1',
        sapSid: 'sid2',
      },
    });
  });
});

describe('mapFormSourceInformationToStructured', () => {
  it('should map InstallationFormValues correctly', () => {
    const form = {
      accessKey: 'key123',
      endpoint: 'endpoint.com',
      bucketId: 'bucket1',
      secretKey: 'secret123',
    };
    const result = mapFormSourceInformationToStructured(form);
    expect(result).toEqual({
      bucketSources: {
        accessKey: 'key123',
        endpoint: 'endpoint.com',
        id: 'bucket1',
        secretKey: 'secret123',
      },
    });
  });
});
