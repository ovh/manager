import angular from 'angular';

import 'angular-translate';
import '@ovh-ux/ui-kit';
import '@ovh-ux/ng-translate-async-loader';

import component from './dedicatedCloud-license-enable.component';
import legacy from './legacy';
import service from './dedicatedCloud-license-enable.service';

const moduleName = 'ovhManagerPccLicenseEnableLegacy';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
    legacy,
  ])
  .component(component.name, component)
  .service('ovhManagerPccLicenseEnableService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
