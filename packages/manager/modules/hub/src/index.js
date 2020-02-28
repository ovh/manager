import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-payment-method';
import '@uirouter/angularjs';
import 'angular-translate';

import billingSummary from './components/billing-summary';
import ovhManagerHubCarousel from './components/carousel';
import ovhManagerHubOrderTracking from './components/order-tracking';
import ovhManagerHubPaymentStatusTile from './components/payment-status-tile';
import ovhManagerHubProducts from './components/products';
import ovhManagerHubSupport from './components/support';
import ovhManagerHubTile from './components/tile';
import userPanel from './components/user-panel';

const moduleName = 'ovhManagerHub';

angular.module(moduleName, [
  billingSummary,
  'ovhManagerCore',
  'pascalprecht.translate',
  'ui.router',
  ovhManagerHubCarousel,
  ovhManagerHubOrderTracking,
  ovhManagerHubPaymentStatusTile,
  ovhManagerHubProducts,
  ovhManagerHubSupport,
  ovhManagerHubTile,
  userPanel,
]);

export default moduleName;
