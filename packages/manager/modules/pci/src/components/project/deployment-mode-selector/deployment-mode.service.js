import { uniqBy } from 'lodash';
import {
  DEPLOYMENT_FEATURES,
  DEPLOYMENT_MODES_TYPES,
  getDeploymentBetaKey,
  getDeploymentComingSoonKey,
  getDeploymentNewKey,
} from './deployment-mode.constant';

export default class DeploymentModeService {
  /* @ngInject */
  constructor($http, coreConfig) {
    this.$http = $http;

    this.PriceFormatter = new Intl.NumberFormat(
      coreConfig.getUserLocale().replace('_', '-'),
      {
        style: 'currency',
        currency: coreConfig.getUser().currency.code,
        maximumFractionDigits: 5,
      },
    );
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
          new: features[getDeploymentNewKey(d)] || false,
        }));
      },
    );
  }

  getFlavorGroupPricesPerDeploymentMode(flavorGroup) {
    return Object.fromEntries(
      DEPLOYMENT_MODES_TYPES.map((d) => {
        const prices = flavorGroup.flavors.flatMap(
          (f) => f.deploymentModesPrices,
        );

        const filteredPrices = prices.filter((p) => p.locationCompatibility[d]);

        if (filteredPrices.length) {
          const uniquePrices = uniqBy(filteredPrices, 'price.price.value');

          const leastPrice = uniquePrices.reduce((acc, curr) => {
            if (curr.price.price.value < acc) {
              return curr.price.price.value;
            }
            return acc;
          }, uniquePrices[0].price.price.value);

          return [
            d,
            {
              values: {
                price: this.PriceFormatter.format(leastPrice),
              },
              key:
                uniquePrices.length === 1
                  ? 'pci_project_flavors_price_hourly'
                  : 'pci_project_flavors_price_hourly_from',
            },
          ];
        }
        return [d, null];
      }),
    );
  }
}
