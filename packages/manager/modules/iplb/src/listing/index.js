import angular from 'angular';
import '@uirouter/angularjs';
import '@ovh-ux/ui-kit';
import '@ovh-ux/manager-core';

import iplbListing from './listing.component';
import route from './listing.route';

const moduleName = 'iplbListing';

angular
  .module(moduleName, ['oui', 'ui.router', 'ovhManagerCore'])
  .component('iplbListing', iplbListing)
  .config(route)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
