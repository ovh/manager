import angular from 'angular';

import '@ovh-ux/ui-kit';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import ngAtInternet from '@ovh-ux/ng-at-internet';
import ngOvhFeatureFlipping from '@ovh-ux/ng-ovh-feature-flipping';

import component from './component';

const moduleName = 'ovhManagerBmServerTechnicalDetailsTileComponent';

angular
  .module(moduleName, [
    'oui',
    'pascalprecht.translate',
    'ngTranslateAsyncLoader',
    ngAtInternet,
    ngOvhFeatureFlipping,
  ])
  .component('bmServerTechnicalDetails', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
