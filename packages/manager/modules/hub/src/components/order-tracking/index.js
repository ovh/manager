import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import '@ovh-ux/ng-ovh-order-tracking';

import ovhManagerHubTileError from '../tile-error';

import component from './component';

import './index.scss';

const moduleName = 'ovhManagerHubOrderTracking';

angular
  .module(moduleName, [
    'ngOvhOrderTracking',
    'ngTranslateAsyncLoader',
    'oui',
    ovhManagerHubTileError,
    'pascalprecht.translate',
  ])
  .component('hubOrderTracking', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
