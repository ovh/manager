import { CONFIG_NAME, BYOIP_FAILOVER_V4 } from './byoip.constants';

export default class ByoipService {
  /* @ngInject */
  constructor($http, $q, coreConfig, User) {
    this.$http = $http;
    this.$q = $q;
    this.User = User;
    this.coreConfig = coreConfig;
  }

  getCatalog() {
    const user = this.coreConfig.getUser();
    return this.$http
      .get('/order/catalog/formatted/bringYourOwnIp', {
        params: {
          ovhSubsidiary: user.ovhSubsidiary,
        },
      })
      .then(({ data }) => {
        const campusList = [];
        let plan = null;

        // Catalog could send us more than one plan so we need to build one plan with all campus and plan code associated to each campus
        data.plans.forEach((el) => {
          if (el.planCode.startsWith(BYOIP_FAILOVER_V4)) {
            // First: initialize plan with values would not change
            if (!plan) {
              plan = {
                addonsFamily: el.addonsFamily,
                consumptionBillingStrategy: el.consumptionBillingStrategy,
                details: {
                  metadatas: el.details.metadatas,
                  pricings: el.details.pricings,
                  product: {
                    description: el.details.product.description,
                    internalType: el.details.product.internalType,
                    name: el.details.product.name,
                    configurations: [
                      el.details.product.configurations.find(
                        ({ name }) => name === 'asNumber',
                      ),
                      el.details.product.configurations.find(
                        ({ name }) => name === 'asRir',
                      ),
                      el.details.product.configurations.find(
                        ({ name }) => name === 'ip',
                      ),
                      el.details.product.configurations.find(
                        ({ name }) => name === 'ipRir',
                      ),
                      el.details.product.configurations.find(
                        ({ name }) => name === CONFIG_NAME.CAMPUS,
                      ),
                    ],
                  },
                },
                invoiceName: el.invoiceName,
                pricingType: el.pricingType,
              };
            }

            const campus = el.details.product.configurations.filter(
              (conf) => conf.name === CONFIG_NAME.CAMPUS,
            );

            // Second: build campus list with campus name and plan code for each campus
            campus.forEach((elem) => {
              elem.values.map((val) => {
                const values = {
                  name: val,
                  planCode: el.planCode,
                };
                campusList.push(values);
                return campusList;
              });
            });
          }
        });

        // Third: update campus configuration with campus list which replace campus values
        const index = plan.details.product.configurations.findIndex(
          ({ name }) => name === CONFIG_NAME.CAMPUS,
        );
        plan.details.product.configurations[index].values = campusList;

        // Finally: return plan
        return plan;
      });
  }

  getToken(region) {
    return this.$http
      .get('/me/bringYourOwnIp/token', {
        params: {
          campus: region.name,
        },
        cache: this.cache,
      })
      .then(({ data }) => data);
  }

  /**
   *
   * @param {*} ipRir [selected ip rir]
   * @param {*} regions [all regions supported by plan]
   * @returns [regions supported by either RIPE / ARIN]
   */
  getIpCampuses(ipRir, regions) {
    return this.$http.get('/ip/campus').then(({ data }) => {
      return data.reduce((acc, val) => {
        const region = regions.find(({ name }) => name === val.name);
        if (val.bringYourOwnIpSupportedRirForIp?.includes(ipRir) && region) {
          acc.push(region);
        }
        return acc;
      }, []);
    });
  }

  /**
   * Redirect to the express order page
   * @param {config} array [configuration of the plan like name, region and others]
   */
  getExpressOrder(config) {
    const updateConfig = config;
    // Retrieve campus config
    const campus = config.find(({ label }) => label === CONFIG_NAME.CAMPUS)
      .values[0];

    // Rebuild config like catalog send us
    const campusId = config.findIndex(
      ({ label }) => label === CONFIG_NAME.CAMPUS,
    );
    updateConfig[campusId].values = [campus.name];

    const params = [
      {
        planCode: campus.planCode,
        configuration: updateConfig,
        option: [],
        quantity: 1,
        productId: 'bringYourOwnIp',
      },
    ];

    return this.getExpressOrderUrl(params);
  }

  getExpressOrderUrl(payload) {
    return this.User.getUrlOf('express_order').then((url) => {
      return `${url}review?products=${JSURL.stringify(payload)}`;
    });
  }
}
