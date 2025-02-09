import { describe, expect } from 'vitest';
import { getSummaryJSON } from './summaryExport';
import { mockedValues } from '@/mocks/installationForm.mock';
import { mockedJSONSummary } from '@/mocks/summaryExport.mock';

describe('getSummaryJSON test suite', () => {
  it('should return the summary as JSON when everything is filled', () => {
    const json = getSummaryJSON(mockedValues);

    expect(json).toEqual(mockedJSONSummary);
  });

  it('should remove optional values when they are undefined', () => {
    const json = getSummaryJSON({
      ...mockedValues,
      logsDataPlatform: undefined,
      bucketBackint: undefined,
      osLicense: undefined,
    });

    expect(json).not.toContain([
      'logsDataPlatform',
      'bucketBackint',
      'osLicense',
    ]);
  });
});
