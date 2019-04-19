import angular from 'angular';
import '@uirouter/angularjs';
import 'ovh-api-services';

import history from './history';
import rights from './rights';
import vouchers from './vouchers';

import controller from './controller';
import template from './template.html';
import service from './service';

const moduleName = 'ovhManagerPciProjectBilling';

angular
  .module(moduleName, [
    history,
    'ovh-api-services',
    rights,
    'ui.router',
    vouchers,
  ])
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider.state('pci.projects.project.legacy.billing', {
      abstract: true,
      url: '/billing',
      views: {
        cloudProject: {
          template,
          controller,
          controllerAs: 'CloudProjectBillingCtrl',
        },
      },
      atInternet: { ignore: true },
    });
  })
  .service('CloudProjectBillingService', service);

export default moduleName;
