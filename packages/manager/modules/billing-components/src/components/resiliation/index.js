import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-payment-method';
import '@ovh-ux/ng-translate-async-loader';

import component from './resiliation.component';
import utils from '../utils';

const moduleName = 'ovhManagerBillingResiliation';

angular
  .module(moduleName, [
    'ovhManagerCore',
    'oui',
    'pascalprecht.translate',
    'ui.router',
    'ngTranslateAsyncLoader',
    'ovhManagerCore',
    utils,
  ])
  .component(component.name, component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
