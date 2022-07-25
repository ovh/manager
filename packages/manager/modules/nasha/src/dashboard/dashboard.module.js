import angular from 'angular';

import '@uirouter/angularjs';
import 'angular-translate';

import '@ovh-ux/ng-at-internet';
import ngOvhFeatureFlipping from '@ovh-ux/ng-ovh-feature-flipping';
import ngOvhPaymentMethod from '@ovh-ux/ng-ovh-payment-method';
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
    'ngAtInternet',
    ngOvhFeatureFlipping,
    ngOvhPaymentMethod,
    ovhManagerBillingComponents,
    editNameComponentModule,
    editNameModule,
    partitionsModule,
    partitionModule,
    spaceMeterComponentsModule,
  ])
  .component('nashaDashboard', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
