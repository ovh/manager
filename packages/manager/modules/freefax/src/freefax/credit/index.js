import angular from 'angular';

import 'ovh-api-services';
import '@ovh-ux/ui-kit';
import '@ovh-ux/ng-ovh-contracts';

import { DISCRETE_CREDIT } from './freefax-credit.constants';
import controller from './freefax-credit.controller';
import template from './freefax-credit.html';

const moduleName = 'managerFreefaxCredit';

angular
  .module(moduleName, ['ngOvhContracts', 'oui'])
  .constant('FREEFAX_DISCRETE_CREDIT', DISCRETE_CREDIT)
  .controller('FreeFaxCreditCtrl', controller)
  .run(
    /* @ngInject */ ($templateCache) => {
      // import templates required by ng-include
      $templateCache.put('freefax/credit/freefax-credit.html', template);
    },
  );

export default moduleName;
