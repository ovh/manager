import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';

import routing from './add.routing';

import './metrics-token-add.less';

const moduleName = 'ovhManagerMetricsTokenAdd';

angular
  .module(moduleName, [
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.router',
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations ../translations ../../translations */);

export default moduleName;
