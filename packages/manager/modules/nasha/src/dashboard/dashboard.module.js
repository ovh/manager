import angular from 'angular';

import '@uirouter/angularjs';
import 'angular-translate';

import component from './dashboard.component';
import routing from './dashboard.routing';

import editNameComponentModule from '../components/edit-name';
import generalInformationModule from './general-information';
import partitionsModule from './partitions';

const moduleName = 'ovhManagerNashaDashboard';

angular
  .module(moduleName, [
    'pascalprecht.translate',
    'ui.router',
    editNameComponentModule,
    generalInformationModule,
    partitionsModule,
  ])
  .component('nashaDashboard', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
