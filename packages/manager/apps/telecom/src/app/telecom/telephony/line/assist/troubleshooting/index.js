import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';

import routing from './troubleshooting.routing';
import templates from './troubleshooting.templates';

import './troubleshooting.less';

const moduleName = 'ovhManagerTelecomTelephonyLineAssistTroubleshooting';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ui.router',
    'ovh-api-services',
  ])
  .config(routing)
  .run(templates)
  .run(/* @ngTranslationsInject:json ./translations ./autoConfig/translations ./manualConfig/translations ./procedure/translations */);

export default moduleName;
