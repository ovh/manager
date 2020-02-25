import angular from 'angular';

import '@ovh-ux/manager-core';
import '@uirouter/angularjs';
import 'angular-translate';

import billingSummary from './components/billing-summary';
import ovhManagerHubCarousel from './components/carousel';
import ovhManagerHubProducts from './components/products';
import ovhManagerHubTile from './components/tile';

const moduleName = 'ovhManagerHub';

angular.module(moduleName, [
  billingSummary,
  'ovhManagerCore',
  'pascalprecht.translate',
  'ui.router',
  ovhManagerHubCarousel,
  ovhManagerHubTile,
  ovhManagerHubProducts,
]);

export default moduleName;
