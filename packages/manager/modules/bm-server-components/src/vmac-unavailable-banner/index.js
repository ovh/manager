import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './vmac-unavailable-banner.component';
import service from './vmac-unavailable-banner.service';

const moduleName = 'ovhManagerVmacUnavailableBanner';

angular
  .module(moduleName, [
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .component(component.name, component)
  .service('VmacUnavailableBannerService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
