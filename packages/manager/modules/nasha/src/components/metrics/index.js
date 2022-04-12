import angular from 'angular';

import 'angular-ui-bootstrap';
import '@ovh-ux/ng-translate-async-loader';

import spaceMeterModule from '../space-meter';

import component from './metrics.component';

const moduleName = 'ovhManagerNashaComponentsMetrics';

angular
  .module(moduleName, [
    'ui.bootstrap',
    'ngTranslateAsyncLoader',
    spaceMeterModule,
  ])
  .component('nashaComponentsMetrics', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
