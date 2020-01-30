import angular from 'angular';
import '@ovh-ux/ng-ovh-contracts';

import controller from './order-overTheBox.controller';
import template from './order-overTheBox.html';

import ovhManagerOtbWarning from '../warning';

const moduleName = 'ovhManagerOtbOrder';

angular
  .module(moduleName, ['ngOvhContracts', ovhManagerOtbWarning])
  .config(($stateProvider) => {
    $stateProvider.state('overTheBox-order', {
      url: '/overTheBox/order',
      template,
      controller,
      controllerAs: 'OrderOverTheBox',
      translations: {
        value: ['.', '..'],
        format: 'json',
      },
    });
  });

export default moduleName;
