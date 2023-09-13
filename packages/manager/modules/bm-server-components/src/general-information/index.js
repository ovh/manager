import angular from 'angular';

import '@ovh-ux/ui-kit';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import ngAtInternet from '@ovh-ux/ng-at-internet';
import ngOvhFeatureFlipping from '@ovh-ux/ng-ovh-feature-flipping';

import component from './general-information.component';

const moduleName = 'ovhManagerBmServerComponentsDashboardGeneralInformation';

angular
  .module(moduleName, [
    ngAtInternet,
    'oui',
    'pascalprecht.translate',
    'ngTranslateAsyncLoader',
    ngOvhFeatureFlipping,
  ])
  .component('serverGeneralInformation', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
