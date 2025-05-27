import { describe, expect, it, test } from 'vitest';
import {
  createApplicationServer,
  getDefaultApplicationServers,
  isApplicationServerDeletable,
  isDefaultApplicationServer,
  isValidApplicationServerList,
} from './applicationServers';
import { ApplicationServer } from '@/types/servers.type';
import { DEFAULT_APPLICATION_SERVER } from './defaultServers.constants';
import { DeploymentType } from '@/types/sapCapabilities.type';
import {
  ApplicationServerRole,
  SERVER_ROLE,
} from './applicationServers.constants';

describe('createApplicationServer test suite', () => {
  it("returns an application server with 'DI' role when no args are passed", () => {
    const vm = createApplicationServer();
    expect(vm.role).toBe(SERVER_ROLE.di);
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
    roles: ApplicationServerRole[];
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

describe('isValidApplicationServerList test suite', () => {
  const baseVM = DEFAULT_APPLICATION_SERVER;
  const testCases: {
    description: string;
    deploymentType: DeploymentType;
    applicationServers: ApplicationServer[];
    expected: boolean;
  }[] = [
    {
      description: 'default server list',
      deploymentType: 'Standard',
      applicationServers: getDefaultApplicationServers('Standard'),
      expected: true,
    },
    {
      description: 'default server list',
      deploymentType: 'Distributed',
      applicationServers: getDefaultApplicationServers('Distributed'),
      expected: true,
    },
    {
      description: 'default server list',
      deploymentType: 'High Availability',
      applicationServers: getDefaultApplicationServers('High Availability'),
      expected: true,
    },
    {
      description: 'list with additional valid server',
      deploymentType: 'Standard',
      applicationServers: [...getDefaultApplicationServers('Standard'), baseVM],
      expected: true,
    },
    {
      description: 'list with additional invalid server',
      deploymentType: 'Standard',
      applicationServers: [
        ...getDefaultApplicationServers('Standard'),
        { ...baseVM, role: SERVER_ROLE.scs },
      ],
      expected: false,
    },
    {
      description: 'duplicated default server list',
      deploymentType: 'Standard',
      applicationServers: [
        ...getDefaultApplicationServers('Standard'),
        ...getDefaultApplicationServers('Standard'),
      ],
      expected: false,
    },
    {
      description: 'default server with incorrect role',
      deploymentType: 'Standard',
      applicationServers: [baseVM],
      expected: false,
    },
    {
      description: 'default list with a server removed',
      deploymentType: 'Distributed',
      applicationServers: [
        ...getDefaultApplicationServers('Distributed').slice(0, -1),
      ],
      expected: false,
    },
  ];

  test.each(testCases)(
    'returns $expected for validity of $description with deploymentType $deploymentType',
    ({ deploymentType, applicationServers, expected }) => {
      const isValidList = isValidApplicationServerList({
        deploymentType,
        applicationServers,
      });

      expect(isValidList).toBe(expected);
    },
  );
});
