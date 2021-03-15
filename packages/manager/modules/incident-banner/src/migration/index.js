import angular from 'angular';

import 'angular-translate';
import '@ovh-ux/ng-at-internet';

import banner from './migration-banner.component';

import './migration.scss';

const moduleName = 'ovhManagerIncidentMigrationBanner';

angular
  .module(moduleName, ['ngAtInternet', 'pascalprecht.translate'])
  .component('ovhManagerIncidentMigrationBanner', banner)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
