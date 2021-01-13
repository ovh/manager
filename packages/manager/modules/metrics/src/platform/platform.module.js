import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';

import ngOvhCloudUniverseComponents from '@ovh-ux/ng-ovh-cloud-universe-components';

import routing from './platform.routing';

import './metrics-platform.less';

const moduleName = 'ovhManagerMetricsPlatform';

angular
  .module(moduleName, [
    ngOvhCloudUniverseComponents,
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.router',
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations ../translations */);

export default moduleName;
