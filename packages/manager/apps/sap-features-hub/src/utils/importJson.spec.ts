import { describe, expect, it } from 'vitest';
import { isImportFormCompatible } from './importJson';
import { StructuredInstallationForm } from '@/types/form.type';
import { mockedStructuredForm } from '@/mocks/installationForm.mock';

describe('isImportFormCompatible test suite', () => {
  it.each([
    [[{ invalidKey: 'test' }], false],
    [{ vdcId: 99, clusterName: 'test' } as StructuredInstallationForm, true],
    [mockedStructuredForm, true],
  ])('should evaluate compatibility of data %s as: %s', (input, expected) => {
    expect(isImportFormCompatible(input)).toBe(expected);
  });
});
