import angular from 'angular';

import includes from 'lodash/includes';
import '@ovh-ux/manager-core';
import '@uirouter/angularjs';
import 'angular-translate';

import component from './user-contracts.component';
import service from './user-contracts.service';

const moduleName = 'ovhManagerUserContracts';

angular
  .module(moduleName, ['ovhManagerCore', 'pascalprecht.translate', 'ui.router'])
  .component('userContracts', component)
  .service('userContractsService', service)
  .run(/* @ngTranslationsInject:json ./translations */)
  .run(($q, $state, userContractsService) =>
    userContractsService
      .getAgreementsToValidate((contract) =>
        includes(['tos', 'pp'], contract.code),
      )
      .then((contracts) => {
        if (contracts.length > 0) {
          $state.go('app.userContracts', { contracts });
        }
      })
      .catch(() => $q.resolve()),
  );

export default moduleName;
