import angular from 'angular';
import '@uirouter/angularjs';
import 'ovh-api-services';


import controller from './controller';
import template from './template.html';

// TODO : import './index.less';

const moduleName = 'ovhManagerPciProjectBillingConsumptionCurrent';

angular
  .module(moduleName, [
    'ovh-api-services',
    'ui.router',
  ])
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider.state('iaas.pci-project.billing.consumption.current', {
      url: '/current',
      views: {
        cloudProjectBillingConsumption: {
          template,
          controller,
          controllerAs: 'BillingConsumptionCurrentCtrl',
        },
      },
      translations: {
        value: ['.'],
        format: 'json',
      },
    });
    console.log('flkdjlfkjdlk');
  });

export default moduleName;
