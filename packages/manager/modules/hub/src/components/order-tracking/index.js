import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-ui-angular';
import '@ovh-ux/ng-ovh-order-tracking';

import component from './component';

import './index.scss';

const moduleName = 'ovhManagerHubOrderTracking';

angular
  .module(moduleName, [
    'ngOvhOrderTracking',
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
  ])
  .component('hubOrderTracking', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
