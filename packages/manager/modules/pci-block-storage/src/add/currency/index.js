import angular from 'angular';
import 'ovh-api-services';
import cloudUniverseComponents from '@ovh-ux/ng-ovh-cloud-universe-components';

import filter from './filter';
import service from './service';

const moduleName = 'cucCurrency';

angular
  .module(moduleName, [cloudUniverseComponents, 'ovh-api-services'])
  .filter('cucUcentsToCurrency', filter)
  .service('CucCurrencyService', service)
  .run(
    /* @ngInject */ (CucCurrencyService) => {
      CucCurrencyService.loadCurrency();
    },
  );

export default moduleName;
