import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';

import ngOvhCloudUniverseComponents from '@ovh-ux/ng-ovh-cloud-universe-components';

import add from './add/add.module';
import routing from './token.routing';

import './metrics-token.less';
import './preview/metrics-token-preview.less';

const moduleName = 'ovhManagerMetricsToken';

angular
  .module(moduleName, [
    add,
    ngOvhCloudUniverseComponents,
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.router',
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations ../translations */);

export default moduleName;
