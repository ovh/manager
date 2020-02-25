import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-payment-method';
import '@uirouter/angularjs';
import 'angular-translate';

import ovhManagerHubProducts from './products';
import ovhManagerHubCarousel from './components/carousel';
import ovhManagerHubTile from './components/tile';
import billingSummary from './components/billing-summary';
import userPanel from './components/user-panel';

const moduleName = 'ovhManagerHub';

angular.module(moduleName, [
  billingSummary,
  'ovhManagerCore',
  'pascalprecht.translate',
  'ui.router',
  ovhManagerHubCarousel,
  ovhManagerHubTile,
  ovhManagerHubProducts,
  userPanel,
]);

export default moduleName;
