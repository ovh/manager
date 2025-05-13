import angular from 'angular';

import 'angular-translate';
import '@ovh-ux/ng-at-internet';

import banner from './banner.component';
import service from './banner.service';

import textBanner from './text-banner';

const moduleName = 'ovhManagerBanner';

angular
  .module(moduleName, [
    'ngAtInternet',
    'ovh-api-services',
    'pascalprecht.translate',
    textBanner,
  ])
  .component('ovhManagerBanner', banner)
  .service('OvhManagerBannerService', service);

export default moduleName;
