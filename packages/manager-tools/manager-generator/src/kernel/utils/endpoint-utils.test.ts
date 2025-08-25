import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { AugmentedAnswers, GeneratorAnswers } from '../../playbook/types/playbook-types';
import { getApiTemplateData } from '../api/api-helper';
import type { MethodGroup, OperationItem } from '../types/inquiries-types';
import {
  buildEndpointChoiceValues,
  isEndpointValueFormat,
  prepareEndpointsForListing,
} from './endpoint-utils';
import { splitApiPathsByVersion } from './paths-utils';
import { servicesToMethodGroup } from './services-utils';
import { makeFakeServiceOperations } from './test-utils';

// --- Mock dependencies ---
vi.mock('../api/api-helper', () => ({
  getApiTemplateData: vi.fn<typeof import('../api/api-helper').getApiTemplateData>(),
}));
vi.mock('./paths-utils', () => ({
  splitApiPathsByVersion: vi.fn<typeof import('./paths-utils').splitApiPathsByVersion>(),
}));
vi.mock('./services-utils', () => ({
  servicesToMethodGroup: vi.fn<typeof import('./services-utils').servicesToMethodGroup>(),
}));

// --- buildEndpointChoiceValues ---
describe('buildEndpointChoiceValues', () => {
  it('returns empty array if no method groups provided', () => {
    expect(buildEndpointChoiceValues()).toEqual([]);
  });

  it('flattens and sorts operation items from v2 and v6', () => {
    const v2: MethodGroup = {
      get: {
        operationList: [
          { apiPath: '/b', functionName: 'two' },
          { apiPath: '/a', functionName: 'one' },
        ] as OperationItem[],
      },
    };
    const v6: MethodGroup = {
      get: {
        operationList: [{ apiPath: '/c', functionName: 'three' }] as OperationItem[],
      },
    };

    const result = buildEndpointChoiceValues(v2, v6);
    expect(result).toEqual(['/a-one', '/b-two', '/c-three']);
  });
});

// --- isEndpointValueFormat ---
describe('isEndpointValueFormat', () => {
  it('returns true for valid format `/path-function`', () => {
    expect(isEndpointValueFormat('/foo-bar')).toBe(true);
  });

  it('returns false if missing dash', () => {
    expect(isEndpointValueFormat('/foo')).toBe(false);
  });

  it('returns false if path part does not start with slash', () => {
    expect(isEndpointValueFormat('foo-bar')).toBe(false);
  });
});

// --- prepareEndpointsForListing ---
describe('prepareEndpointsForListing', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('sets templates and processes apiPaths into v2 and v6 groups', async () => {
    vi.mocked(splitApiPathsByVersion).mockReturnValue({ v2: ['/v2'], v6: ['/v6'] });

    const fakeService = makeFakeServiceOperations({ path: '/v6' });

    vi.mocked(getApiTemplateData)
      .mockResolvedValueOnce({ endpoints: [fakeService], v2Ops: 0, v6Ops: 1 })
      .mockResolvedValueOnce({ endpoints: [fakeService], v2Ops: 0, v6Ops: 1 });

    vi.mocked(servicesToMethodGroup)
      .mockReturnValueOnce({
        get: { operationList: [{ apiPath: '/v6', functionName: 'f6' }] as OperationItem[] },
      })
      .mockReturnValueOnce({
        get: { operationList: [{ apiPath: '/v2', functionName: 'f2' }] as OperationItem[] },
      });

    const answers: GeneratorAnswers = {
      appName: 'test',
      apiPaths: ['/v2', '/v6'],
    } as GeneratorAnswers;

    await prepareEndpointsForListing(answers);

    const augmented = answers as AugmentedAnswers;
    expect(augmented.templates).toEqual(['listing', 'dashboard']);
    expect(splitApiPathsByVersion).toHaveBeenCalledWith(['/v2', '/v6']);
    expect(getApiTemplateData).toHaveBeenCalledWith('v6', ['/v6']);
    expect(getApiTemplateData).toHaveBeenCalledWith('v2', ['/v2']);
    expect(servicesToMethodGroup).toHaveBeenCalledTimes(2);
    expect(augmented.apiV6Endpoints?.get?.operationList?.[0]?.apiPath).toBe('/v6');
    expect(augmented.apiV2Endpoints?.get?.operationList?.[0]?.apiPath).toBe('/v2');
  });
});
