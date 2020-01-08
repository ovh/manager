import angular from 'angular';
import 'ovh-api-services';

import cucConfig from '../config';

import filter from './filter';
import service from './service';

const moduleName = 'cucCurrency';

angular
  .module(moduleName, [cucConfig, 'ovh-api-services'])
  .filter('cucUcentsToCurrency', filter)
  .service('CucCurrencyService', service)
  .run(
    /* @ngInject */ (CucCurrencyService) => {
      CucCurrencyService.loadCurrency();
    },
  );

export default moduleName;
