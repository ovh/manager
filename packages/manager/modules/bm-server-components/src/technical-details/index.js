import angular from 'angular';

import '@ovh-ux/ui-kit';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import ngAtInternet from '@ovh-ux/ng-at-internet';
import ngOvhFeatureFlipping from '@ovh-ux/ng-ovh-feature-flipping';

import component from './technical-details.component';

const moduleName = 'ovhManagerBmServerComponentsDashboardTechnicalDetails';

angular
  .module(moduleName, [
    ngAtInternet,
    'oui',
    'pascalprecht.translate',
    'ngTranslateAsyncLoader',
    ngOvhFeatureFlipping,
  ])
  .component('serverTechnicalDetails', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
