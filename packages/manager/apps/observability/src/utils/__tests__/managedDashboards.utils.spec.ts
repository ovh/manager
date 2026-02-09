import { describe, expect, it } from 'vitest';

import { DatasourceConfiguration } from '@/types/DatasourceConfiguration';
import { Grafana, GrafanaListing, GrafanaState } from '@/types/managedDashboards.type';
import { mapGrafanaToListing } from '@/utils/managedDashboards.utils';

type GrafanaOverrides = Omit<Partial<Grafana>, 'currentState'> & {
  currentState?: Partial<GrafanaState>;
};

describe('managedDashboards.utils', () => {
  describe('mapGrafanaToListing', () => {
    const createGrafana = (overrides: GrafanaOverrides): Grafana => {
      const baseGrafana: Grafana = {
        id: 'grafana-default',
        createdAt: '2025-11-21T14:26:14.041Z',
        updatedAt: '2025-11-21T14:26:14.041Z',
        resourceStatus: 'READY',
        currentState: {
          title: 'Default Grafana',
          description: 'Default description',
          datasource: {
            fullySynced: true,
          },
          release: {
            id: 'release-default',
            version: '10.0.0',
            status: 'SUPPORTED',
          },
        },
      };

      return {
        ...baseGrafana,
        ...overrides,
        currentState: {
          ...baseGrafana.currentState,
          ...overrides.currentState,
          datasource: {
            ...baseGrafana.currentState.datasource,
            ...overrides.currentState?.datasource,
          },
          release: overrides.currentState?.release ?? baseGrafana.currentState.release,
        },
      };
    };

    it('should map grafana to listing format with all properties', () => {
      const mockGrafana = createGrafana({
        id: 'grafana-1',
        updatedAt: '2025-12-01T10:30:00.000Z',
        currentState: {
          title: 'Grafana Dashboard 1',
          description: 'Main monitoring dashboard',
          endpoint: 'https://grafana.example.com',
          datasource: {
            fullySynced: true,
          },
          allowedNetworks: ['192.168.1.0/24'],
          infrastructure: {
            id: 'infra-1',
            entryPoint: 'grafana1.metrics.ovh.com',
            location: 'eu-west-sbg',
            type: 'SHARED',
            publicIpAddress: '192.168.1.100',
            certificationLevel: 'STANDARD',
          },
        },
        iam: {
          id: 'iam-1',
          urn: 'urn:v1:eu:resource:grafana:grafana-1',
        },
      });

      const result: GrafanaListing[] = mapGrafanaToListing([mockGrafana]);

      expect(result).toEqual([
        {
          id: 'grafana-1',
          name: 'Grafana Dashboard 1',
          description: 'Main monitoring dashboard',
          infrastructure: mockGrafana.currentState.infrastructure,
          entryPoint: 'grafana1.metrics.ovh.com',
          endpoint: 'https://grafana.example.com',
          configuration: DatasourceConfiguration.AUTOMATIC,
          version: '10.0.0',
          deprecated: false,
          isAccessLimited: true,
          resourceStatus: 'READY',
          updatedAt: '2025-12-01T10:30:00.000Z',
          urn: 'urn:v1:eu:resource:grafana:grafana-1',
          search:
            'Grafana Dashboard 1 Main monitoring dashboard grafana1.metrics.ovh.comautomatic 10.0.0',
        },
      ]);
    });

    it.each([
      {
        description: 'automatic datasource configuration when fullySynced is true',
        fullySynced: true,
        expected: DatasourceConfiguration.AUTOMATIC,
      },
      {
        description: 'manual datasource configuration when fullySynced is false',
        fullySynced: false,
        expected: DatasourceConfiguration.MANUAL,
      },
    ])('should map to $description', ({ fullySynced, expected }) => {
      const mockGrafana = createGrafana({
        id: 'grafana-datasource',
        currentState: {
          title: 'Test Grafana',
          description: 'Test description',
          datasource: {
            fullySynced,
          },
        },
      });

      const result = mapGrafanaToListing([mockGrafana]);

      expect(result).toHaveLength(1);
      expect(result[0]?.configuration).toBe(expected);
    });

    it.each([
      {
        description: 'grafana without infrastructure',
        grafana: createGrafana({
          id: 'grafana-no-infra',
          currentState: {
            title: 'Grafana Without Infrastructure',
            description: 'No infrastructure description',
            datasource: {
              fullySynced: false,
            },
          },
        }),
        expectations: (result: GrafanaListing) => {
          expect(result.infrastructure).toBeUndefined();
          expect(result.entryPoint).toBeUndefined();
          expect(result.isAccessLimited).toBe(false);
        },
      },
      {
        description: 'grafana without endpoint',
        grafana: createGrafana({
          id: 'grafana-no-endpoint',
          currentState: {
            title: 'Grafana Without Endpoint',
            description: 'No endpoint description',
            datasource: {
              fullySynced: true,
            },
          },
        }),
        expectations: (result: GrafanaListing) => {
          expect(result.endpoint).toBeUndefined();
        },
      },
      {
        description: 'grafana without publicIpAddress (not access limited)',
        grafana: createGrafana({
          id: 'grafana-public',
          currentState: {
            title: 'Public Grafana',
            description: 'Public access',
            datasource: {
              fullySynced: true,
            },
            infrastructure: {
              id: 'infra-public',
              entryPoint: 'public.grafana.com',
              location: 'GRA11',
              type: 'SHARED',
              certificationLevel: 'STANDARD',
            },
          },
        }),
        expectations: (result: GrafanaListing) => {
          expect(result.isAccessLimited).toBe(false);
        },
      },
      {
        description: 'grafana with allowedNetworks (access limited)',
        grafana: createGrafana({
          id: 'grafana-limited',
          currentState: {
            title: 'Limited Grafana',
            description: 'Limited access',
            datasource: {
              fullySynced: true,
            },
            allowedNetworks: ['10.0.0.0/24'],
            infrastructure: {
              id: 'infra-limited',
              entryPoint: 'limited.grafana.com',
              location: 'GRA11',
              type: 'SHARED',
              publicIpAddress: '10.0.0.1',
              certificationLevel: 'STANDARD',
            },
          },
        }),
        expectations: (result: GrafanaListing) => {
          expect(result.isAccessLimited).toBe(true);
        },
      },
      {
        description: 'grafana without iam',
        grafana: createGrafana({
          id: 'grafana-no-iam',
          currentState: {
            title: 'Grafana Without IAM',
            description: 'No IAM',
            datasource: {
              fullySynced: true,
            },
          },
        }),
        expectations: (result: GrafanaListing) => {
          expect(result.urn).toBeUndefined();
        },
      },
      {
        description: 'grafana with deprecated version',
        grafana: createGrafana({
          id: 'grafana-deprecated',
          currentState: {
            title: 'Deprecated Grafana',
            description: 'Old version',
            datasource: {
              fullySynced: true,
            },
            release: {
              id: 'release-deprecated',
              version: '8.0.0',
              status: 'DEPRECATED',
            },
          },
        }),
        expectations: (result: GrafanaListing) => {
          expect(result.deprecated).toBe(true);
          expect(result.version).toBe('8.0.0');
        },
      },
    ])('should handle $description', ({ grafana, expectations }) => {
      const mockGrafanas: Grafana[] = [grafana];
      const result = mapGrafanaToListing(mockGrafanas);

      expect(result).toHaveLength(1);
      const firstResult = result[0];
      expect(firstResult).toBeDefined();
      if (firstResult) {
        expectations(firstResult);
      }
    });

    it('should map multiple grafanas correctly', () => {
      const mockGrafanas: Grafana[] = [
        createGrafana({
          id: 'grafana-1',
          updatedAt: '2025-12-01T10:00:00.000Z',
          currentState: {
            title: 'First Grafana',
            description: 'First description',
            endpoint: 'https://first.grafana.com',
            datasource: {
              fullySynced: true,
            },
            infrastructure: {
              id: 'infra-1',
              entryPoint: 'first.metrics.ovh.com',
              location: 'GRA11',
              type: 'SHARED',
              certificationLevel: 'STANDARD',
            },
          },
          iam: {
            id: 'iam-1',
            urn: 'urn:v1:grafana:1',
          },
        }),
        createGrafana({
          id: 'grafana-2',
          updatedAt: '2025-12-01T11:00:00.000Z',
          currentState: {
            title: 'Second Grafana',
            description: 'Second description',
            datasource: {
              fullySynced: false,
            },
            release: {
              id: 'release-2',
              version: '9.5.0',
              status: 'DEPRECATED',
            },
          },
          iam: {
            id: 'iam-2',
            urn: 'urn:v1:grafana:2',
          },
        }),
      ];

      const result = mapGrafanaToListing(mockGrafanas);

      expect(result).toHaveLength(2);
      expect(result).toEqual([
        {
          id: 'grafana-1',
          name: 'First Grafana',
          description: 'First description',
          infrastructure: {
            id: 'infra-1',
            entryPoint: 'first.metrics.ovh.com',
            location: 'GRA11',
            type: 'SHARED',
            certificationLevel: 'STANDARD',
          },
          entryPoint: 'first.metrics.ovh.com',
          endpoint: 'https://first.grafana.com',
          configuration: DatasourceConfiguration.AUTOMATIC,
          version: '10.0.0',
          deprecated: false,
          isAccessLimited: false,
          resourceStatus: 'READY',
          updatedAt: '2025-12-01T10:00:00.000Z',
          urn: 'urn:v1:grafana:1',
          search: 'First Grafana First description first.metrics.ovh.comautomatic 10.0.0',
        },
        {
          id: 'grafana-2',
          name: 'Second Grafana',
          description: 'Second description',
          infrastructure: undefined,
          entryPoint: undefined,
          endpoint: undefined,
          configuration: DatasourceConfiguration.MANUAL,
          version: '9.5.0',
          deprecated: true,
          isAccessLimited: false,
          resourceStatus: 'READY',
          updatedAt: '2025-12-01T11:00:00.000Z',
          urn: 'urn:v1:grafana:2',
          search: 'Second Grafana Second description manual 9.5.0',
        },
      ]);
    });

    it.each([
      {
        description: 'empty grafana array',
        grafanas: [] as Grafana[],
        expectedLength: 0,
        expectations: () => {},
      },
      {
        description: 'single grafana',
        grafanas: [
          createGrafana({
            id: 'grafana-single',
            currentState: {
              title: 'Single Grafana',
              description: 'Single description',
              datasource: {
                fullySynced: true,
              },
            },
          }),
        ],
        expectedLength: 1,
        expectations: (result: GrafanaListing[]) => {
          expect(result[0]?.id).toBe('grafana-single');
          expect(result[0]?.name).toBe('Single Grafana');
        },
      },
    ])('should handle $description', ({ grafanas, expectedLength, expectations }) => {
      const result = mapGrafanaToListing(grafanas);

      expect(result).toHaveLength(expectedLength);
      expectations(result);
    });

    it.each([
      {
        description: 'grafana ids',
        grafanas: [
          createGrafana({
            id: 'unique-id-1',
            currentState: {
              title: 'Grafana 1',
              description: 'Description 1',
              datasource: { fullySynced: true },
            },
          }),
          createGrafana({
            id: 'unique-id-2',
            currentState: {
              title: 'Grafana 2',
              description: 'Description 2',
              datasource: { fullySynced: false },
            },
          }),
        ],
        expectations: (result: GrafanaListing[]) => {
          expect(result.map((g) => g.id)).toEqual(['unique-id-1', 'unique-id-2']);
          expect(result.map((g) => g.name)).toEqual(['Grafana 1', 'Grafana 2']);
        },
      },
      {
        description: 'infrastructure',
        grafanas: [
          createGrafana({
            id: 'grafana-with-infra',
            currentState: {
              title: 'Grafana With Infrastructure',
              description: 'Has infrastructure',
              datasource: { fullySynced: true },
              infrastructure: {
                id: 'infra-id',
                entryPoint: 'grafana.metrics.ovh.net',
                location: 'GRA11',
                type: 'SHARED',
                certificationLevel: 'STANDARD',
              },
            },
          }),
        ],
        expectations: (result: GrafanaListing[]) => {
          expect(result[0]?.entryPoint).toBe('grafana.metrics.ovh.net');
          expect(result[0]?.infrastructure).toBeDefined();
        },
      },
    ])('should preserve $description correctly', ({ grafanas, expectations }) => {
      const result = mapGrafanaToListing(grafanas);

      expectations(result);
    });

    it('should format search string correctly with all optional fields', () => {
      const mockGrafanas: Grafana[] = [
        createGrafana({
          id: 'grafana-search',
          currentState: {
            title: 'Search Test',
            description: 'Search description',
            datasource: {
              fullySynced: true,
            },
            infrastructure: {
              id: 'infra-search',
              entryPoint: 'search.grafana.com',
              location: 'GRA11',
              type: 'SHARED',
              certificationLevel: 'STANDARD',
            },
            release: {
              id: 'release-search',
              version: '10.5.0',
              status: 'SUPPORTED',
            },
          },
        }),
      ];

      const result = mapGrafanaToListing(mockGrafanas);

      expect(result[0]?.search).toBe(
        'Search Test Search description search.grafana.comautomatic 10.5.0',
      );
    });

    it('should format search string correctly without entryPoint', () => {
      const mockGrafanas: Grafana[] = [
        createGrafana({
          id: 'grafana-no-entry',
          currentState: {
            title: 'No Entry Point',
            description: 'No entry point description',
            datasource: {
              fullySynced: false,
            },
            release: {
              id: 'release-no-entry',
              version: '9.0.0',
              status: 'SUPPORTED',
            },
          },
        }),
      ];

      const result = mapGrafanaToListing(mockGrafanas);

      expect(result[0]?.search).toBe('No Entry Point No entry point description manual 9.0.0');
    });

    it.each([
      ['READY', 'READY'],
      ['UPDATING', 'UPDATING'],
      ['ERROR', 'ERROR'],
      ['DELETING', 'DELETING'],
      ['CREATING', 'CREATING'],
    ] as const)('should preserve resourceStatus %s', (status, expected) => {
      const grafana = createGrafana({
        id: 'grafana-status',
        resourceStatus: status,
      });

      const result = mapGrafanaToListing([grafana]);

      expect(result[0]?.resourceStatus).toBe(expected);
    });

    it.each([
      {
        description: 'null updatedAt',
        updatedAt: null,
        expected: null,
      },
      {
        description: 'valid updatedAt',
        updatedAt: '2025-12-15T08:30:00.000Z',
        expected: '2025-12-15T08:30:00.000Z',
      },
    ])('should handle $description', ({ updatedAt, expected }) => {
      const grafana = createGrafana({
        id: 'grafana-updated',
        updatedAt,
      });

      const result = mapGrafanaToListing([grafana]);

      expect(result[0]?.updatedAt).toBe(expected);
    });

    it.each([
      {
        description: 'version values',
        releases: [
          { id: 'release-1', version: '10.0.0', status: 'SUPPORTED' as const },
          { id: 'release-2', version: '9.5.3', status: 'SUPPORTED' as const },
          { id: 'release-3', version: '8.0.0', status: 'DEPRECATED' as const },
        ],
        expectations: (result: GrafanaListing[]) => {
          expect(result.map((g) => g.version)).toEqual(['10.0.0', '9.5.3', '8.0.0']);
          expect(result.map((g) => g.deprecated)).toEqual([false, false, true]);
        },
      },
    ])('should preserve $description correctly', ({ releases, expectations }) => {
      const grafanas = releases.map((release, idx) =>
        createGrafana({
          id: `grafana-version-${idx}`,
          currentState: {
            title: `Grafana ${idx}`,
            description: `Description ${idx}`,
            datasource: { fullySynced: true },
            release,
          },
        }),
      );

      const result = mapGrafanaToListing(grafanas);

      expectations(result);
    });

    it('should include configuration in search string', () => {
      const mockGrafanas: Grafana[] = [
        createGrafana({
          id: 'grafana-auto',
          currentState: {
            title: 'Auto Config',
            description: 'Auto description',
            datasource: { fullySynced: true },
          },
        }),
        createGrafana({
          id: 'grafana-manual',
          currentState: {
            title: 'Manual Config',
            description: 'Manual description',
            datasource: { fullySynced: false },
          },
        }),
      ];

      const result = mapGrafanaToListing(mockGrafanas);

      expect(result[0]?.search).toContain('automatic');
      expect(result[1]?.search).toContain('manual');
    });
  });
});
