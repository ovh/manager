import { describe, expect, it, test } from 'vitest';
import {
  createApplicationServer,
  getDefaultApplicationServers,
  isApplicationServerDeletable,
  isDefaultApplicationServer,
} from './applicationServers';
import { ApplicationServer } from '@/types/servers.type';
import { DEFAULT_APPLICATION_SERVER } from './defaultServers.constants';
import { DeploymentType, SAPRole } from '@/types/sapCapabilities.type';

describe('createApplicationServer test suite', () => {
  it("returns an application server with 'DI' role when no args are passed", () => {
    const vm = createApplicationServer();
    expect(vm.role).toBe('DI');
    expect(vm).toStrictEqual(DEFAULT_APPLICATION_SERVER);
  });

  test.each([
    { key: 'name', value: 'APPVM1' },
    { key: 'instanceNumber', value: '42' },
    { key: 'vcpus', value: 4 },
  ])('returns an application server with $key as $value', ({ key, value }) => {
    const vm = createApplicationServer({ [key]: value });
    expect(vm[key as keyof ApplicationServer]).toBe(value);
  });
});

describe('getDefaultApplicationServer test suite', () => {
  const testCases: {
    deploymentType: DeploymentType;
    length: number;
    roles: SAPRole[];
  }[] = [
    { deploymentType: 'Standard', length: 1, roles: ['SCS'] },
    { deploymentType: 'Distributed', length: 2, roles: ['SCS', 'CI'] },
    {
      deploymentType: 'High Availability',
      length: 4,
      roles: ['SCS', 'ERS', 'CI', 'DI'],
    },
  ];

  test.each(testCases)(
    'returns corresponding default application servers for deployment type of $deploymentType',
    ({ deploymentType, length, roles }) => {
      const vms = getDefaultApplicationServers(deploymentType);
      expect(vms).toHaveLength(length);
      expect(vms.map((vm) => vm.role)).toStrictEqual(roles);
    },
  );
});

describe('isDefaultApplicationServer test suite', () => {
  const testCases: {
    deploymentType: DeploymentType;
    serverIndex: number;
    expected: boolean;
  }[] = [
    { deploymentType: 'Standard', serverIndex: 0, expected: true },
    { deploymentType: 'Standard', serverIndex: 1, expected: false },
    { deploymentType: 'Distributed', serverIndex: 0, expected: true },
    { deploymentType: 'Distributed', serverIndex: 1, expected: true },
    { deploymentType: 'Distributed', serverIndex: 2, expected: false },
    { deploymentType: 'High Availability', serverIndex: 0, expected: true },
    { deploymentType: 'High Availability', serverIndex: 1, expected: true },
    { deploymentType: 'High Availability', serverIndex: 2, expected: true },
    { deploymentType: 'High Availability', serverIndex: 3, expected: true },
    { deploymentType: 'High Availability', serverIndex: 4, expected: false },
  ];

  test.each(testCases)(
    'returns $expected for server at index $serverIndex with deploymentType $deploymentType',
    ({ deploymentType, serverIndex, expected }) => {
      const isDefault = isDefaultApplicationServer({
        deploymentType,
        serverIndex,
      });
      expect(isDefault).toBe(expected);
    },
  );
});

describe('isApplicationServerDeletable test suite', () => {
  const testCases: {
    deploymentType: DeploymentType;
    serverIndex: number;
    expected: boolean;
  }[] = [
    { deploymentType: 'Standard', serverIndex: 0, expected: false },
    { deploymentType: 'Standard', serverIndex: 1, expected: true },
    { deploymentType: 'Distributed', serverIndex: 0, expected: false },
    { deploymentType: 'Distributed', serverIndex: 1, expected: false },
    { deploymentType: 'Distributed', serverIndex: 2, expected: true },
    { deploymentType: 'High Availability', serverIndex: 0, expected: false },
    { deploymentType: 'High Availability', serverIndex: 1, expected: false },
    { deploymentType: 'High Availability', serverIndex: 2, expected: false },
    { deploymentType: 'High Availability', serverIndex: 3, expected: true },
    { deploymentType: 'High Availability', serverIndex: 4, expected: true },
  ];

  test.each(testCases)(
    'returns $expected for server at index $serverIndex with deploymentType $deploymentType',
    ({ deploymentType, serverIndex, expected }) => {
      const isDefault = isApplicationServerDeletable({
        deploymentType,
        serverIndex,
      });
      expect(isDefault).toBe(expected);
    },
  );
});
