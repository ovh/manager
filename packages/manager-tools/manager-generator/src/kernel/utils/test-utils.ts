import type { AugmentedAnswers } from '../../playbook/types/playbook-types';
import { ServiceOperations } from '../types/api-types';

export function makeAnswers(overrides: Partial<AugmentedAnswers> = {}): AugmentedAnswers {
  return {
    appName: 'demo',
    description: '',
    universe: 'cloud',
    subUniverse: 'manager',
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

    ...overrides,
  };
}

export function makeFakeServiceOperations(
  overrides?: Partial<ServiceOperations>,
): ServiceOperations {
  return {
    path: '/fake',
    description: 'Fake service for tests',
    operations: [{ method: 'GET', nickname: 'fakeOp', summary: 'Fake summary' }],
    ...overrides,
  };
}
