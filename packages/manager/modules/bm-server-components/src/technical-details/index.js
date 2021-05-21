import angular from 'angular';
import ngAtInternet from '@ovh-ux/ng-at-internet';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';
import ngOvhFeatureFlipping from '@ovh-ux/ng-ovh-feature-flipping';

import component from './component';

const moduleName = 'ovhManagerBmServerTechnicalDetailsTileComponent';

angular
  .module(moduleName, [
    'oui',
    'pascalprecht.translate',
    ngOvhFeatureFlipping,
    ngAtInternet,
  ])
  .component('bmServerTechnicalDetails', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
