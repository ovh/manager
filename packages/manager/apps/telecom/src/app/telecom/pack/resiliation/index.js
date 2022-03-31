import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';

import routing from './pack-resiliation.routing';
import component from './pack-resiliation.component';

import './pack-resiliation.less';

const moduleName = 'ovhManagerTelecomPackResiliation';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
  ])
  .config(routing)
  .component('packResiliation', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
