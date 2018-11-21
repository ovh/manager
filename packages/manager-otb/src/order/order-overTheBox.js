import angular from 'angular';
import controller from './order-overTheBox.controller';
import template from './order-overTheBox.html';

import overTheBoxWarningNoPaymentMeans from '../warning/overTheBox-warning-noPaymentMeans.html';
import overTheBoxWarningNotFound from '../warning/overTheBox-warning-notFound.html';
import overTheBoxWarningNoSubscription from '../warning/overTheBox-warning-noSubscription.html';
import overTheBoxWarningDeviceToLink from '../warning/overTheBox-warning-deviceToLink.html';

const moduleName = 'ovhManagerOtbOrder';

angular.module(moduleName, [])
  .run(($templateCache) => {
    // import templates required by ng-include
    $templateCache.put('app/telecom/overTheBox/warning/overTheBox-warning-noPaymentMeans.html', overTheBoxWarningNoPaymentMeans);
    $templateCache.put('app/telecom/overTheBox/warning/overTheBox-warning-notFound.html', overTheBoxWarningNotFound);
    $templateCache.put('app/telecom/overTheBox/warning/overTheBox-warning-noSubscription.html', overTheBoxWarningNoSubscription);
    $templateCache.put('app/telecom/overTheBox/warning/overTheBox-warning-deviceToLink.html', overTheBoxWarningDeviceToLink);
  })
  .config(($stateProvider) => {
    $stateProvider.state('overTheBox-order', {
      url: '/overTheBox/order',
      template,
      controller,
      controllerAs: 'OrderOverTheBox',
      translations: [
        '.',
        '..',
        '../warning',
      ],
    });
  });

export default moduleName;
