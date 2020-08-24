import angular from 'angular';

import { includes, isEmpty, isArray } from 'lodash';
import '@ovh-ux/manager-core';
import '@ovh-ux/ui-kit';
import '@uirouter/angularjs';
import 'angular-translate';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';

import component from './user-contracts.component';
import service from './user-contracts.service';
import { CONTRACTS_LIST } from './user-contracts.constant';

const moduleName = 'ovhManagerUserContracts';

angular
  .module(moduleName, [
    ngTranslateAsyncLoader,
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
  ])
  .component('userContracts', component)
  .service('userContractsService', service)
  .run(/* @ngTranslationsInject:json ./translations */)
  .run(($q, $state, coreConfig, userContractsService) =>
    userContractsService
      .getAgreementsToValidate((contract) =>
        includes(CONTRACTS_LIST, contract.code),
      )
      .then((contracts) => {
        const region = coreConfig.getRegion();
        if (region === 'US' && isArray(contracts) && !isEmpty(contracts)) {
          $state.go('app.userContracts', { contracts });
        }
      })
      .catch(() => $q.resolve()),
  );

export default moduleName;
