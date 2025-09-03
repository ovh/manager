import { ObsFeatureType } from '@ovh-ux/observability/src/types';

export default {
  listing: {
    datagrid: {
      serviceKey: 'obs',
    },
  },
  rootLabel: 'Observability',
  ObsEnabledFeatures: [ObsFeatureType.Metrics, ObsFeatureType.Logs],
  defaultFeature: ObsFeatureType.Logs,
};
