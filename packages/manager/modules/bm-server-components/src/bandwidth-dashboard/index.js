import angular from 'angular';

import '@ovh-ux/ui-kit';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';

import component from './dashboard.component';
import publicBandwidthTileDefinition from './public-bandwidth-tile-definition';

const moduleName = 'ovhManagerBmServerBandwidthDashboardComponent';

angular
  .module(moduleName, [
    'oui',
    'pascalprecht.translate',
    'ngTranslateAsyncLoader',
    publicBandwidthTileDefinition,
  ])
  .component('serverBandwidthDashboard', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
