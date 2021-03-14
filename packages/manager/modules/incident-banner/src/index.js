import angular from 'angular';

import 'angular-translate';
import '@ovh-ux/ng-at-internet';

import banner from './banner.component';

const moduleName = 'ovhManagerIncidentBanner';

angular
  .module(moduleName, ['pascalprecht.translate'])
  .component('ovhManagerIncidentBanner', banner);

export default moduleName;
