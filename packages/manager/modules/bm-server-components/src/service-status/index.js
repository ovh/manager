import angular from 'angular';

import '@ovh-ux/ui-kit';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import ngAtInternet from '@ovh-ux/ng-at-internet';
import ngOvhFeatureFlipping from '@ovh-ux/ng-ovh-feature-flipping';

import component from './service-status.component';

const moduleName = 'ovhManagerBmServerComponentsDashboardServiceStatus';

angular
  .module(moduleName, [
    ngAtInternet,
    'oui',
    'pascalprecht.translate',
    'ngTranslateAsyncLoader',
    ngOvhFeatureFlipping,
  ])
  .component('serverServiceStatus', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
