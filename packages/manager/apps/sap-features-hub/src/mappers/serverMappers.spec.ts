import { describe, expect, it, test } from 'vitest';
import {
  ApplicationServer,
  ApplicationServerExport,
  HanaServer,
  HanaServerExport,
} from '@/types/servers.type';
import {
  mockedValues as mock,
  mockedStructuredForm,
} from '@/mocks/installationForm.mock';
import { serverMappers } from '@/mappers/serverMappers';

type ServerKey = keyof HanaServer | keyof ApplicationServer;
type ServerExportKey = keyof HanaServerExport | keyof ApplicationServerExport;

describe('serverMappers.toExport test suite', () => {
  const testCases: {
    type: 'hana' | 'application';
    expectedProperty: ServerExportKey;
    excludedProperty: ServerExportKey;
  }[] = [
    {
      type: 'hana',
      expectedProperty: 'thickDatastorePolicy',
      excludedProperty: 'role',
    },
    {
      type: 'application',
      expectedProperty: 'role',
      excludedProperty: 'thickDatastorePolicy',
    },
  ];

  test.each(testCases)(
    'returns an export for $type servers, with property $expectedProperty and without $excludedProperty',
    ({ type, expectedProperty, excludedProperty }) => {
      const vms = serverMappers.toExport({ form: mock, type });
      vms.forEach((vm) => {
        expect(vm).toHaveProperty(expectedProperty);
        expect(vm).not.toHaveProperty(excludedProperty);
      });
    },
  );
});

describe('serverMappers.toBase test suite', () => {
  const baseKeys: ServerKey[] = [
    'name',
    'ipAddress',
    'instanceNumber',
    'rootPassword',
    'memory',
    'vcpus',
  ];
  const exportKeys: ServerExportKey[] = [
    'network',
    'netmask',
    'gateway',
    'passwordCrypted',
    'thickDatastorePolicy',
    'ovaTemplate',
    'passwordCrypted',
    'datastoreName',
  ];

  const testCases: {
    type: 'hana' | 'application';
    mappedServers: HanaServer[] | ApplicationServer[];
    expectedProperties: ServerKey[];
    excludedProperties: ServerExportKey[];
  }[] = [
    {
      type: 'hana',
      mappedServers: serverMappers.toBase({
        form: mockedStructuredForm,
        type: 'hana',
      }),
      expectedProperties: baseKeys,
      excludedProperties: [...exportKeys, 'role'],
    },
    {
      type: 'application',
      mappedServers: serverMappers.toBase({
        form: mockedStructuredForm,
        type: 'application',
      }),
      expectedProperties: [...baseKeys, 'role'],
      excludedProperties: [...exportKeys],
    },
  ];

  it.each(testCases)(
    'return mapped $type servers with only specific properties',
    ({ mappedServers, expectedProperties, excludedProperties }) => {
      mappedServers.forEach((vm) => {
        expectedProperties.forEach((prop) => expect(vm).toHaveProperty(prop));
        excludedProperties.forEach((prop) =>
          expect(vm).not.toHaveProperty(prop),
        );

        expect(Object.keys(vm)).toHaveLength(expectedProperties.length);
      });
    },
  );
});
