import angular from 'angular';

import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import ovhManagerBillingComponents from '@ovh-ux/manager-billing-components';
import componentsModule from '../../components';
import editNameModule from './edit-name';

import component from './general-information.component';
import routing from './general-information.routing';

const moduleName = 'ovhManagerNashaDashboardGeneralInformation';

angular
  .module(moduleName, [
    'pascalprecht.translate',
    'ui.router',
    'oui',
    ovhManagerBillingComponents,
    componentsModule,
    editNameModule,
  ])
  .component('nashaDashboardGeneralInformation', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
