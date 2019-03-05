import angular from 'angular';
import '@uirouter/angularjs';
import 'ovh-api-services';

import controller from './controller';
import template from './template.html';

import './index.less';

const moduleName = 'ovhManagerPciProjectBillingHistoryDetails';

angular
  .module(moduleName, [
    'ovh-api-services',
    'ui.router',
  ])
  .config(/* @ngInject */($stateProvider) => {

    $stateProvider.state('iaas.pci-project.billing.history.details', {
      url: '',
      views: {
        cloudProjectHistory: {
          template,
          controller,
          controllerAs: 'BillingHistoryDetailsCtrl',
        },
      },
      translations: {
        value: ['.'],
        format: 'json',
      },
    });
  });

export default moduleName;
