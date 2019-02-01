import filter from 'lodash/filter';
import get from 'lodash/get';
import map from 'lodash/map';

import { EXCHANGE_ACCOUNT_URL } from './constants';

export default class {
  /* @ngInject */
  constructor(
    $http,
    OvhApiPackXdslExchangeAccount,
  ) {
    this.$http = $http;
    this.OvhApiPackXdslExchangeAccount = OvhApiPackXdslExchangeAccount;
  }

  $onInit() {
    this.services = [];

    this.loading = true;

    return this.OvhApiPackXdslExchangeAccount
      .Services()
      .v6()
      .query({
        packName: this.pack.packName,
      })
      .$promise
      .then(serviceIds => this.$http.get(
        '/email/exchange/*/service/*/account?$aggreg=1', {
          serviceType: 'apiv7',
        },
      ).then((servicesParam) => {
        let services = servicesParam;
        services = get(services, 'data');

        this.services = filter(
          map(
            filter(
              services,
              service => service.value !== null,
            ),
            (service) => {
              const [,,, organizationName,, exchangeService] = service.path.split('/');
              return {
                ...service.value,
                organizationName,
                exchangeService,
                exchangeServiceUrl: EXCHANGE_ACCOUNT_URL
                  .replace('{organizationName}', organizationName)
                  .replace('{exchangeService}', exchangeService),
              };
            },
          ),
          service => serviceIds.indexOf(`${service.exchangeService}-${service.id}`) > -1,
        );
      }))
      .finally(() => {
        this.loading = false;
      });
  }
}
