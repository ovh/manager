import { ObservabilityServiceParams } from '@/data/api/observability.props';
import { Grafana } from '@/types/managedDashboards.type';

const grafanasDataset: Grafana[] = [
  {
    createdAt: '2025-07-22T09:58:20.619Z',
    currentState: {
      datasource: {
        fullySynced: false,
      },
      version: {
        value: '1.3.45',
        deprecated: false,
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
      version: {
        value: '1.0.1',
        deprecated: true,
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
  console.info(`[MOCK-ADAPTER][getGrafanas] for ${resourceName}`);
  return Promise.resolve(grafanasDataset);
};
