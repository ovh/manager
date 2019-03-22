import angular from 'angular';
import '@ovh-ux/ng-ovh-api-wrappers'; // should be a peer dependency of ovh-api-services
import '@ovh-ux/ng-ovh-toaster';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ng-at-internet';
import 'ovh-api-services';

import service from './service';

const moduleName = 'ovhManagerPciComponentsProjectAdd';

angular
  .module(moduleName, [
    'ng-at-internet',
    'ngOvhToaster',
    'ngTranslateAsyncLoader',
    'ovh-api-services',
    'pascalprecht.translate',
  ])
  .service('CloudProjectAdd', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
