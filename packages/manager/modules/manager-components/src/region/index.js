import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './component';
import service from './service';

import './index.scss';

const moduleName = 'ovhManagerRegion';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
  ])
  .component('ovhManagerRegionSelector', component)
  .service('ovhManagerRegionService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
