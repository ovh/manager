import angular from 'angular';
import '@ovh-ux/ng-at-internet';
import '@ovh-ux/ng-ovh-feature-flipping';
import '@ovh-ux/ui-kit';
import 'angular-translate';

import component from './component';

const moduleName = 'cucPciComponentsBetaPublicCloudBanner';

angular
  .module(moduleName, [
    'ngAtInternet',
    'ngOvhFeatureFlipping',
    'oui',
    'pascalprecht.translate',
  ])
  .component('cucPciAnnouncementBanner', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
