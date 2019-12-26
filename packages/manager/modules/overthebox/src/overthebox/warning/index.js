import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';

import overTheBoxWarningController from './overTheBox-warning.controller';
import overTheBoxWarningDeviceToLinkController from './overTheBox-warning-deviceToLink.controller';
import overTheBoxWarningNoPaymentMeans from './overTheBox-warning-noPaymentMeans.html';
import overTheBoxWarningNotFound from './overTheBox-warning-notFound.html';
import overTheBoxWarningNoSubscription from './overTheBox-warning-noSubscription.html';
import overTheBoxWarningNotActivated from './overTheBox-warning-notActivated.html';
import overTheBoxWarningDeviceToLink from './overTheBox-warning-deviceToLink.html';

const moduleName = 'ovhManagerOtbWarning';

angular
  .module(moduleName, [])
  .controller('OverTheBoxWarningCtrl', overTheBoxWarningController)
  .controller(
    'OverTheBoxWarningDeviceToLinkCtrl',
    overTheBoxWarningDeviceToLinkController,
  )
  .run(/* @ngTranslationsInject:json ./translations */)
  .run(($templateCache) => {
    // import templates required by ng-include
    $templateCache.put(
      'overTheBox/warning/overTheBox-warning-noPaymentMeans.html',
      overTheBoxWarningNoPaymentMeans,
    );
    $templateCache.put(
      'overTheBox/warning/overTheBox-warning-notFound.html',
      overTheBoxWarningNotFound,
    );
    $templateCache.put(
      'overTheBox/warning/overTheBox-warning-noSubscription.html',
      overTheBoxWarningNoSubscription,
    );
    $templateCache.put(
      'overTheBox/warning/overTheBox-warning-notActivated.html',
      overTheBoxWarningNotActivated,
    );
    $templateCache.put(
      'overTheBox/warning/overTheBox-warning-deviceToLink.html',
      overTheBoxWarningDeviceToLink,
    );
  });

export default moduleName;
