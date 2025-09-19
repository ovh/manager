import OvhProductName from '@ovh-ux/ovh-product-icons/utils/OvhProductNameEnum';
import illustration from '@/assets/images/sidebar/security-identity-operations.png';
import { Node } from '../node';

const sioUniverse: Node = {
  id: 'observability',
  idAttr: 'observability-link',
  translation: 'sidebar_observability',
  shortTranslation: 'sidebar_observability_short',
  illustration,
  svgIcon: OvhProductName.SHIELDCHECK,
  routing: {
    application: 'observability',
  },
  hasService: false,
  features: ['observability'],
};

sioUniverse.children = [
  {
    id: 'dashboards',
    idAttr: 'dashboards-link',
    translation: 'sidebar_observability_dashboards',
    universe: sioUniverse.id,
    features: ['observability:dashboards'],
    routing: {
      application: 'observability',
      hash: '#/dashboards',
    },
  },
  {
    id: 'metrics',
    idAttr: 'metrics-link',
    translation: 'sidebar_observability_metrics',
    universe: sioUniverse.id,
    features: ['observability:metrics'],
    children: [
      {
        id: 'observability-metrics-tenants',
        idAttr: 'observability-metrics-tenants-link',
        translation: 'sidebar_observability_metrics_tenants',
        universe: sioUniverse.id,
        serviceType: 'DBAAS_LOGS',
        features: ['observability:metrics:tenants'],
        routing: {
          application: 'observability',
          hash: '#/metrics/tenants',
        },
      },
    ],
  },
];

export default sioUniverse;
