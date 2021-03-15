import angular from 'angular';

import 'angular-translate';
import '@ovh-ux/ng-at-internet';

import banner from './banner.component';
import migrationBanner from './migration';

const moduleName = 'ovhManagerIncidentBanner';

angular
  .module(moduleName, ['pascalprecht.translate', migrationBanner])
  .component('ovhManagerIncidentBanner', banner);

export default moduleName;
