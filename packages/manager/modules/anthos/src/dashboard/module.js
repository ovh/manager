import angular from 'angular';
import '@ovh-ux/manager-core';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';

import ovhManagerBillingComponents from '@ovh-ux/manager-billing-components';

import component from './component';
import routing from './routing';
import storage from './storage';

import generalInformation from './general-information';
import host from './host';

const moduleName = 'ovhManagerAnthosDashboard';

angular
  .module(moduleName, [
    'ovhManagerCore',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'oui',
    'ui.router',
    ovhManagerBillingComponents,
    generalInformation,
    host,
    storage,
  ])
  .config(routing)
  .component('anthosDashboard', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
