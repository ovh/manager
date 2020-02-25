import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';
import 'ovh-ui-angular';

import { ERROR_STATUS } from './order-tracking.constants';
import component from './order-tracking.component';
import service from './order-tracking.service';
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
  .service('OrderTracking', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export { ERROR_STATUS };

export default moduleName;
