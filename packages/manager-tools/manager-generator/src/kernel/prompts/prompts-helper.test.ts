import { describe, expect, it } from 'vitest';

import type { GeneratorAnswers } from '../../playbook/types/playbook-types';
import type { OperationItem, PromptChoice } from '../types/inquiries-types';
import { makeAnswers } from '../utils/test-utils';
import { applyDerivations, transformPromptsChoicesToStrings } from './prompts-helper';

// --- transformPromptsChoicesToStrings ---
describe('transformPromptsChoicesToStrings', () => {
  it('converts array of strings to string array', () => {
    const input: PromptChoice[] = ['a', 'b'];
    expect(transformPromptsChoicesToStrings(input)).toEqual(['a', 'b']);
  });

  it('converts array of objects with value', () => {
    const input: PromptChoice[] = [
      { name: 'foo', value: 'x' },
      { name: 'bar', value: 'y' },
    ];
    expect(transformPromptsChoicesToStrings(input)).toEqual(['x', 'y']);
  });

  it('handles mixed string and object inputs', () => {
    const input: PromptChoice[] = ['z', { name: 'foo', value: 'x' }];
    expect(transformPromptsChoicesToStrings(input)).toEqual(['z', 'x']);
  });

  it('ignores objects without value property', () => {
    const input = [{ name: 'oops' }] as unknown as PromptChoice[];
    expect(transformPromptsChoicesToStrings(input)).toEqual([]);
  });
});

// --- applyDerivations (integration test for all private helpers) ---
describe('applyDerivations', () => {
  it('computes PCI flags, extracts paths, and sets v6 version', () => {
    const d = makeAnswers({
      appName: 'pci-myapp',
      apiV6Endpoints: {
        get: {
          operationList: [{ apiPath: '/foo', functionName: 'fn' } as OperationItem],
        },
      },
      listingEndpoint: '/foo-fn' as never,
      dashboardEndpoint: '/foo-fn' as never,
    });

    applyDerivations(d as GeneratorAnswers);

    expect(d.isPCI).toBe(true);
    expect(d.pciName).toBe('myapp');
    expect(d.listingEndpointPath).toBe('/foo');
    expect(d.dashboardEndpointPath).toBe('/foo');
    expect(d.mainApiPathApiVersion).toBe('v6');
    expect(d.apiV6Computed?.get?.operationList).toHaveLength(1);
  });

  it('sets v2 version when listing path matches v2 endpoints', () => {
    const d = makeAnswers({
      appName: 'web',
      apiV2Endpoints: {
        get: {
          operationList: [{ apiPath: '/bar/{projectId}', functionName: 'fn' } as OperationItem],
        },
      },
      listingEndpoint: '/bar/{projectId}-fn' as never,
      dashboardEndpoint: '/bar/{projectId}-fn' as never,
    });

    applyDerivations(d as GeneratorAnswers);

    expect(d.isPCI).toBe(false);
    expect(d.mainApiPathApiVersion).toBe('v2');
    expect(d.apiV2Computed?.get?.operationList?.[0]?.apiPath).toBe('/bar/{projectId}');
  });

  it('filters v2 computed operations to include /serviceInfos', () => {
    const d = makeAnswers({
      apiV2Endpoints: {
        get: {
          operationList: [
            { apiPath: '/bar', functionName: 'fn1' } as OperationItem,
            { apiPath: '/bar/serviceInfos', functionName: 'fn2' } as OperationItem,
          ],
        },
      },
      listingEndpoint: '/bar-fn1' as never,
      dashboardEndpoint: '/bar-fn1' as never,
    });

    applyDerivations(d as GeneratorAnswers);

    const ops = d.apiV2Computed?.get?.operationList ?? [];
    expect(ops.some((o) => o.apiPath.includes('/serviceInfos'))).toBe(true);
  });
});
