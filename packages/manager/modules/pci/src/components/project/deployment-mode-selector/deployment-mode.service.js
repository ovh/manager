import {
  DEPLOYMENT_FEATURES,
  DEPLOYMENT_MODES_TYPES,
  getDeploymentBetaKey,
  getDeploymentComingSoonKey,
} from './deployment-mode.constant';

export default class DeploymentModeService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  checkFeatureAvailability(featuresList) {
    return this.$http
      .get(`/feature/${featuresList.join(',')}/availability`, {
        params: {
          app: 'pci-instances',
        },
        serviceType: 'aapi',
        cache: true,
      })
      .then(({ data }) => data);
  }

  getFeaturedDeploymentModes() {
    return this.checkFeatureAvailability(DEPLOYMENT_FEATURES).then(
      (features) => {
        return DEPLOYMENT_MODES_TYPES.map((d) => ({
          name: d,
          beta: features[getDeploymentBetaKey(d)] || false,
          comingSoon: features[getDeploymentComingSoonKey(d)] || false,
        }));
      },
    );
  }
}
