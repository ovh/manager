import angular from 'angular';

import '@ovh-ux/ui-kit';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import ngAtInternet from '@ovh-ux/ng-at-internet';
import serverBandwidthDashboard from '../bandwidth-dashboard';
import component from './component';

const moduleName = 'ovhManagerBmServerComponentsBandwidthTileComponent';

angular
  .module(moduleName, [
    ngAtInternet,
    'oui',
    'pascalprecht.translate',
    'ngTranslateAsyncLoader',
    serverBandwidthDashboard,
  ])
  .component('serverBandwidthTile', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
