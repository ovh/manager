import mockLogger from '@/__mocks__/mock.logger';
import {
  CreateGrafanaPayload,
  GetGrafanaPayload,
  GetGrafanaReleasesParams,
} from '@/data/api/grafana.props';
import { ObservabilityServiceParams } from '@/data/api/observability.props';
import { Grafana, GrafanaReleasesResponse } from '@/types/managedDashboards.type';

const grafanaReleasesDataset: GrafanaReleasesResponse = {
  releases: [
    {
      id: '3ab58ad6-729c-430a-a1e1-a1cb71823115',
      status: 'DEPRECATED',
      version: '11.1.0rc1',
      upgradableTo: [
        {
          id: 'a2ab9e69-b39c-4a34-af34-49fa45933065',
          status: 'SUPPORTED',
          version: '12.2.1',
        },
        {
          id: '52799d18-0071-4fd9-85dc-673ad5e520a6',
          status: 'SUPPORTED',
          version: '12.2.1rc1',
        },
      ],
    },
    {
      id: 'a2ab9e69-b39c-4a34-af34-49fa45933065',
      status: 'SUPPORTED',
      version: '11.1.0',
      upgradableTo: [
        {
          id: '52799d18-0071-4fd9-85dc-673ad5e520a6',
          status: 'SUPPORTED',
          version: '12.2.1',
        },
        {
          id: '3ab58ad6-729c-430a-a1e1-a1cb71823115',
          status: 'SUPPORTED',
          version: '12.2.1rc1',
        },
      ],
    },
    {
      id: '52799d18-0071-4fd9-85dc-673ad5e520a6',
      status: 'SUPPORTED',
      version: '12.2.1',
      downgradableTo: [
        {
          id: 'a2ab9e69-b39c-4a34-af34-49fa45933065',
          status: 'SUPPORTED',
          version: '11.1.0',
        },
      ],
      upgradableTo: [
        {
          id: '3ab58ad6-729c-430a-a1e1-a1cb71823115',
          status: 'SUPPORTED',
          version: '12.2.1rc1',
        },
      ],
    },
  ],
};

const grafanasDataset: Grafana[] = [
  {
    createdAt: '2025-07-22T09:58:20.619Z',
    currentState: {
      datasource: {
        fullySynced: false,
      },
      description: 'My grafana test',
      endpoint: 'https://grafana-qwlwe6-gra1.metrics.ovh.com',
      infrastructure: {
        certificationLevel: 'STANDARD',
        entryPoint: 'gra1.metrics.ovh.com',
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        location: 'eu-west-gra',
        publicIpAddress: '54.39.46.56',
        type: 'SHARED',
      },
      title: 'My grafana',
      release: {
        id: '3ab58ad6-729c-430a-a1e1-a1cb71823115',
        status: 'DEPRECATED',
        version: '11.1.0rc1',
        upgradableTo: [
          {
            id: 'a2ab9e69-b39c-4a34-af34-49fa45933065',
            status: 'SUPPORTED',
            version: '12.2.1',
          },
          {
            id: '52799d18-0071-4fd9-85dc-673ad5e520a6',
            status: 'SUPPORTED',
            version: '12.2.1rc1',
          },
        ],
      },
    },
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    resourceStatus: 'READY',
    iam: {
      id: '4691a219-7eea-4385-b64b-80f7220cf19c',
      tags: {
        'ovh:ldp:cluster:name': 'mimir',
        'ovh:ldp:service:id': '31ed12da-d06b-4ca2-a737-9f8a8411a907',
        'ovh:region': 'eu-west-gra',
      },
      urn: 'urn:v1:eu:resource:ldp:ldp-gr-55078/tenant/019b0cfb-5990-7a17-8d58-18936bfd1ddc',
    },
    updatedAt: '2025-07-22T09:58:20.619Z',
  },
  {
    createdAt: '2025-07-25T09:58:20.619Z',
    currentState: {
      datasource: {
        fullySynced: true,
      },
      description: 'Description Grafana 2',
      endpoint: 'https://grafana-2-gra1.metrics.ovh.com',
      infrastructure: {
        certificationLevel: 'STANDARD',
        entryPoint: 'gra1.metrics.ovh.com',
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        location: 'eu-west-gra',
        type: 'SHARED',
      },
      title: 'Grafana 2',
      release: {
        id: 'a2ab9e69-b39c-4a34-af34-49fa45933065',
        status: 'SUPPORTED',
        version: '11.1.0',
        upgradableTo: [
          {
            id: '52799d18-0071-4fd9-85dc-673ad5e520a6',
            status: 'SUPPORTED',
            version: '12.2.1',
          },
          {
            id: '3ab58ad6-729c-430a-a1e1-a1cb71823115',
            status: 'SUPPORTED',
            version: '12.2.1rc1',
          },
        ],
      },
    },
    id: '2dc71f64-5717-4562-b3fc-2c963f66af25',
    resourceStatus: 'READY',
    iam: {
      id: '155c54c1-7efd-49e3-9358-b1a2860a56cc',
      tags: {
        'ovh:ldp:cluster:name': 'mimir',
        'ovh:ldp:service:id': '31ed12da-d06b-4ca2-a737-9f8a8411a907',
        'ovh:region': 'eu-west-gra',
      },
      urn: 'urn:v1:eu:resource:ldp:ldp-gr-55078/tenant/019ad9a2-7438-735e-bb05-e397e1d9be7e',
    },
    updatedAt: '2025-07-25T09:58:20.619Z',
  },
];

export const getGrafanas = async ({
  resourceName,
}: ObservabilityServiceParams): Promise<Grafana[]> => {
  mockLogger.info(`[getGrafanas] for ${resourceName}`);
  return Promise.resolve(grafanasDataset);
};

export const getGrafana = async ({
  resourceName,
  grafanaId,
}: GetGrafanaPayload): Promise<Grafana> => {
  mockLogger.info(`[getGrafana] mock getting a Grafana instance for ${resourceName}`);
  mockLogger.info(`[getGrafana] grafanaId ->`, grafanaId);

  let grafana = grafanasDataset.find(({ id }: Grafana) => id === grafanaId);

  if (!grafana) {
    throw new Error(`[MOCK-ADAPTER][getGrafana] Grafana instance with id "${grafanaId}" not found`);
  }

  return Promise.resolve(grafana);
};

export const createGrafana = async (payload: CreateGrafanaPayload): Promise<Grafana> => {
  mockLogger.info(`[createGrafana] for ${payload.resourceName}`, { payload });
  return Promise.resolve(grafanasDataset[0]!);
};

export const getGrafanaReleases = async ({
  resourceName,
  infrastructureId,
}: GetGrafanaReleasesParams): Promise<GrafanaReleasesResponse> => {
  mockLogger.info(`[getGrafanaReleases] for ${resourceName}, infrastructure ${infrastructureId}`);
  return Promise.resolve(grafanaReleasesDataset);
};

export const deleteGrafana = async ({
  resourceName,
  grafanaId,
}: GetGrafanaPayload): Promise<Grafana> => {
  mockLogger.info(`[deleteGrafana] mock deletion of a Grafana instance for ${resourceName}`);
  mockLogger.info(`[deleteGrafana] grafanaId ->`, grafanaId);

  let grafana = grafanasDataset.find(({ id }: Grafana) => id === grafanaId);

  if (!grafana) {
    throw new Error(
      `[MOCK-ADAPTER][deleteGrafana] Grafana instance with id "${grafanaId}" not found`,
    );
  }

  return Promise.resolve(grafana);
};
