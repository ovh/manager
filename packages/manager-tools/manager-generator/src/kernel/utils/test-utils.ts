import type { AugmentedAnswers } from '../../playbook/types/playbook-types';
import { ServiceOperations } from '../types/api-types';

export function makeAnswers(overrides: Partial<AugmentedAnswers> = {}): AugmentedAnswers {
  return {
    appName: 'demo',
    description: '',
    universe: 'cloud',
    subUniverse: 'manager',
    serviceKey: 'demo-service',
    regions: ['EU'],
    universes: ['Manager'],
    flavor: 'standard',
    mainApiPath: '/default',
    listingEndpointPath: '/default',
    dashboardEndpointPath: '/default',
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
    listingApi: 'v6Iceberg',
    dashboardApi: 'v6',

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
    dashboardEndpointFn: undefined,
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
