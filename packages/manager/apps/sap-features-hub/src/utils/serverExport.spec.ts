import { describe, expect, test } from 'vitest';
import {
  ApplicationServerExport,
  HanaServerExport,
} from '@/types/servers.type';
import { getServersExport } from './serverExport';
import { mockedValues as mock } from '@/mocks/installationForm.mock';

describe('getServersExport test suite', () => {
  const testCases: {
    type: 'hana' | 'application';
    propertyExpected: keyof HanaServerExport | keyof ApplicationServerExport;
    propertyExcluded: keyof HanaServerExport | keyof ApplicationServerExport;
  }[] = [
    {
      type: 'hana',
      propertyExpected: 'thickDatastorePolicy',
      propertyExcluded: 'role',
    },
    {
      type: 'application',
      propertyExpected: 'role',
      propertyExcluded: 'thickDatastorePolicy',
    },
  ];

  test.each(testCases)(
    'returns an export for $type servers, with property $propertyExpected and without $propertyExcluded',
    ({ type, propertyExpected, propertyExcluded }) => {
      const vms = getServersExport({ form: mock, type });
      vms.forEach((vm) => {
        expect(vm).toHaveProperty(propertyExpected);
        expect(vm).not.toHaveProperty(propertyExcluded);
      });
    },
  );
});
