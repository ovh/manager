import angular from 'angular';
import '@uirouter/angularjs';
import 'ovh-api-services';

import controller from './controller';
import template from './template.html';

import './index.less';

const moduleName = 'ovhManagerPciProjectBillingHistory';

angular
  .module(moduleName, [
    'ovh-api-services',
    'ui.router',
  ])
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider.state('iaas.pci-project.billing.rights', {
      url: '/rights',
      views: {
        cloudProjectBilling: {
          template,
          controller,
          controllerAs: 'BillingRightsCtrl',
        },
      },
      translations: {
        value: ['.'],
        format: 'json',
      },
    });
  });

export default moduleName;
