import angular from 'angular';

import '@ovh-ux/manager-core';
import '@uirouter/angularjs';
import 'angular-translate';

import ovhManagerHubTile from './components/tile';

const moduleName = 'ovhManagerHub';

angular.module(moduleName, [
  'ovhManagerCore',
  'pascalprecht.translate',
  'ui.router',
  ovhManagerHubTile,
]);

export default moduleName;
