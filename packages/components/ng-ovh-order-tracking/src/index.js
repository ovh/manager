import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';
import 'ovh-ui-angular';

import component from './order-tracking.component';
import './index.scss';

const moduleName = 'ngOvhOrderTracking';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    'ovh-api-services',
    'pascalprecht.translate',
  ])
  .component('ovhOrderTrackingComponent', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
