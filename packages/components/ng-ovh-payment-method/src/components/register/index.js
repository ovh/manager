import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';

import '@ovh-ux/ui-kit';

import component from './component';

const moduleName = 'ngOvhPaymentMethodRegister';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'oui',
  ])
  .run(/* @ngTranslationsInject:json ./translations */)
  .component(component.name, component);

export default moduleName;
