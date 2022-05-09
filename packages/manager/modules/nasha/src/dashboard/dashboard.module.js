import angular from 'angular';

import '@uirouter/angularjs';
import 'angular-translate';

import ovhManagerBillingComponents from '@ovh-ux/manager-billing-components';

import spaceMeterComponentsModule from '../components/space-meter';
import editNameComponentModule from '../components/edit-name';
import editNameModule from './edit-name';
import partitionsModule from './partitions';
import partitionModule from './partition';

import component from './dashboard.component';
import routing from './dashboard.routing';

const moduleName = 'ovhManagerNashaDashboard';

angular
  .module(moduleName, [
    'pascalprecht.translate',
    'ui.router',
    editNameComponentModule,
    editNameModule,
    ovhManagerBillingComponents,
    partitionsModule,
    partitionModule,
    spaceMeterComponentsModule,
  ])
  .component('nashaDashboard', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
