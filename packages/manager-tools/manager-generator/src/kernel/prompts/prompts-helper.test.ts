import { describe, expect, it } from 'vitest';

import { AugmentedAnswers } from '../../playbook/types/playbook-types';
import { ApiPathChoice } from '../types/api-types';
import { OperationItem } from '../types/inquiries-types';
import {
  applyDerivations,
  buildEndpointChoiceValues,
  choicesToStrings,
  computeComputedGroups,
  computeFlags,
  derivePkgName,
  ensureSuffix,
  extractSelectedPaths,
  isEndpointValueFormat,
  isManualValue,
  isNameValue,
  isSeparatorLike,
  normalizeApiPathChoices,
  setMainApiVersion,
} from './prompts-helper';

/**
 * Factory to create a full AugmentedAnswers object with safe defaults.
 * Each test can override only the fields it needs.
 */
function makeAnswers(overrides: Partial<AugmentedAnswers> = {}): AugmentedAnswers {
  return {
    // GeneratorAnswers required fields
    appName: 'demo',
    description: '',
    universe: 'cloud',
    subUniverse: 'manager',
    appType: 'pci',
    serviceKey: 'demo-service',
    region: 'EU',
    flavor: 'standard',
    mainApiPath: '/default',
    listingEndpointPath: '/default',
    onboardingEndpointPath: '/default',
    language: 'en',
    framework: 'React',
    level2: '120',
    usePreset: false,
    userEmail: 'test@example.com',
    out: '/tmp',

    // optional GeneratorAnswers
    appSlug: 'demo',
    isPci: true,
    routeFlavor: 'pci',
    basePrefix: '',
    serviceParam: 'serviceName',
    platformParam: 'platformId',
    listingApi: 'v6Iceberg',
    onboardingApi: 'v6',

    // AugmentedAnswers extras
    templates: [],
    apiPathsByApiVersion: undefined,
    apiV6Endpoints: undefined,
    apiV2Endpoints: undefined,
    isPCI: true,
    pciName: 'demo',
    isApiV6: false,
    isApiV2: false,
    listingEndpointFn: undefined,
    mainApiPathApiVersion: undefined,
    mainApiPathPci: undefined,
    onboardingEndpointFn: undefined,
    apiV6Computed: undefined,
    apiV2Computed: undefined,

    // overrides last
    ...overrides,
  };
}

// eslint-disable-next-line max-lines-per-function
describe('prompts-helper basics', () => {
  it('ensureSuffix adds suffix only once', () => {
    expect(ensureSuffix('demo', '-app')).toBe('demo-app');
    expect(ensureSuffix('demo-app', '-app')).toBe('demo-app');
  });

  it('derivePkgName uses explicit packageName if provided', () => {
    expect(derivePkgName('foo', 'custom')).toBe('custom');
  });

  it('derivePkgName normalizes names', () => {
    expect(derivePkgName('PCI DEMO')).toBe('@ovh-ux/manager-pcidemo-app');
  });

  it('isNameValue detects {name,value}', () => {
    expect(isNameValue({ name: 'x', value: 'y' })).toBe(true);
    expect(isNameValue({})).toBe(false);
  });

  it('isSeparatorLike detects separator entries', () => {
    expect(isSeparatorLike({ type: 'separator', line: '---' })).toBe(true);
    expect(isSeparatorLike({ type: 'foo' })).toBe(false);
  });

  it('normalizeApiPathChoices handles all shapes', () => {
    const res = normalizeApiPathChoices([
      '/iam',
      { name: 'a', value: 'b' },
      { type: 'separator', line: '---' },
      42 as unknown,
    ] as unknown as ApiPathChoice[]);
    expect(res).toEqual([
      { name: '/iam', value: '/iam' },
      { name: 'a', value: 'b' },
      { name: '---', disabled: true },
      { name: '42', value: '42' },
    ]);
  });

  it('isEndpointValueFormat validates correctly', () => {
    expect(isEndpointValueFormat('/foo-bar')).toBe(true);
    expect(isEndpointValueFormat('foo')).toBe(false);
  });

  it('choicesToStrings extracts values', () => {
    expect(choicesToStrings(['a', { name: 'x', value: 'y' }])).toEqual(['a', 'y']);
  });

  it('buildEndpointChoiceValues flattens and sorts', () => {
    const v2 = {
      get: {
        operationList: [
          { apiPath: '/b', functionName: 'two' },
          { apiPath: '/a', functionName: 'one' },
        ],
      },
    };
    expect(buildEndpointChoiceValues(v2)).toEqual(['/a-one', '/b-two']);
  });
});

// eslint-disable-next-line max-lines-per-function
describe('prompts-helper extra coverage', () => {
  it('ensureSuffix with empty suffix returns same string', () => {
    expect(ensureSuffix('demo', '')).toBe('demo');
  });

  it('derivePkgName strips invalid chars and keeps suffix', () => {
    expect(derivePkgName('App@#Name')).toBe('@ovh-ux/manager-appname-app');
    expect(derivePkgName('demo-app')).toBe('@ovh-ux/manager-demo-app');
  });

  it('computeFlags detects PCI and API versions', () => {
    const d = makeAnswers({
      appName: 'pci-demo',
      apiV6Endpoints: { get: { operationList: [{} as OperationItem] } },
      apiV2Endpoints: { get: { operationList: [] } },
    });

    computeFlags(d);
    expect(d.isPCI).toBe(true);
    expect(d.pciName).toBe('demo');
    expect(d.isApiV6).toBe(true);
    expect(d.isApiV2).toBe(false);
  });

  it('computeFlags works with non-PCI app and no endpoints', () => {
    const d = makeAnswers({ appName: 'web' });
    computeFlags(d);
    expect(d.isPCI).toBe(false);
    expect(d.isApiV6).toBe(false);
    expect(d.isApiV2).toBe(false);
  });

  it('setMainApiVersion marks v2 and computes pci path', () => {
    const d = makeAnswers({
      appName: 'pci-demo',
      isPCI: true,
      isApiV2: true,
      apiV2Endpoints: {
        get: {
          operationList: [{ apiPath: '/foo/{projectId}', functionName: 'fn' } as OperationItem],
        },
      },
    });

    setMainApiVersion(d, '/foo/{projectId}');
    expect(d.mainApiPathApiVersion).toBe('v2');
    expect(d.mainApiPathPci).toBe('/foo/${projectId}');
  });

  it('setMainApiVersion does not compute pci path for non-PCI app', () => {
    const d = makeAnswers({
      isPCI: false,
      isApiV6: true,
      apiV6Endpoints: {
        get: { operationList: [{ apiPath: '/foo', functionName: 'fn' }] },
      },
    });

    setMainApiVersion(d, '/foo');
    expect(d.mainApiPathApiVersion).toBe('v6');
    expect(d.mainApiPathPci).toBeUndefined();
  });

  it('computeComputedGroups filters down to listing/onboarding', () => {
    const d = makeAnswers({
      appName: 'demo',
      isApiV6: true,
      isApiV2: true,
      apiV6Endpoints: {
        get: {
          operationList: [
            { apiPath: '/foo', functionName: 'fn1' },
            { apiPath: '/x', functionName: 'ignore' },
          ],
        },
      },
      apiV2Endpoints: {
        get: {
          operationList: [
            { apiPath: '/bar', functionName: 'fn2' },
            { apiPath: '/bar/serviceInfos', functionName: 'extra' },
          ],
        },
      },
    });

    computeComputedGroups(d, '/foo', '/bar');
    expect(d?.apiV6Computed?.get?.operationList).toEqual([
      { apiPath: '/foo', functionName: 'fn1' },
    ]);
    expect(
      d?.apiV2Computed?.get?.operationList?.some((op) => op.apiPath.includes('serviceInfos')),
    ).toBe(true);
  });

  it('computeComputedGroups leaves empty lists if no matches', () => {
    const d = makeAnswers({
      isApiV6: true,
      isApiV2: true,
      apiV6Endpoints: { get: { operationList: [{ apiPath: '/nope', functionName: 'fn' }] } },
      apiV2Endpoints: { get: { operationList: [{ apiPath: '/nope2', functionName: 'fn' }] } },
    });

    computeComputedGroups(d, '/foo', '/bar');
    expect(d.apiV6Computed?.get?.operationList).toEqual([]);
    expect(
      d.apiV2Computed?.get?.operationList?.some((op) => op.apiPath.includes('serviceInfos')),
    ).toBe(false);
  });

  it('extractSelectedPaths splits listing and onboarding endpoints correctly', () => {
    const d = makeAnswers({
      listingEndpoint: '/foo-listFn' as never,
      onboardingEndpoint: '/bar-dashFn' as never,
    });

    const result = extractSelectedPaths(d);

    expect(result).toEqual({
      listingPath: '/foo',
      listingFn: 'listFn',
      onboardingPath: '/bar',
      onboardingFn: 'dashFn',
    });
    expect(d.mainApiPath).toBe('/foo');
  });

  it('applyDerivations runs all derivation steps end-to-end', () => {
    const d = makeAnswers({
      appName: 'pci-myapp',
      apiV6Endpoints: { get: { operationList: [{ apiPath: '/foo', functionName: 'fn' }] } },
      listingEndpoint: '/foo-fn' as never,
      onboardingEndpoint: '/foo-fn' as never,
    });

    applyDerivations(d);

    expect(d.isPCI).toBe(true);
    expect(d.listingEndpointPath).toBe('/foo');
    expect(d.mainApiPathApiVersion).toBe('v6');
    expect(d.apiV6Computed?.get?.operationList).toHaveLength(1);
  });

  it('isEndpointValueFormat rejects strings without dash or without "/" prefix', () => {
    expect(isEndpointValueFormat('foo')).toBe(false);
    expect(isEndpointValueFormat('foo-bar')).toBe(false);
    expect(isEndpointValueFormat('/foo')).toBe(false);
  });

  it('isManualValue detects manual marker and ignores non-strings', () => {
    expect(isManualValue('MANUAL', 'MANUAL')).toBe(true);
    expect(isManualValue('AUTO', 'MANUAL')).toBe(false);
    expect(isManualValue(123, 'MANUAL')).toBe(false);
    expect(isManualValue({ v: 'MANUAL' }, 'MANUAL')).toBe(false);
  });
});
