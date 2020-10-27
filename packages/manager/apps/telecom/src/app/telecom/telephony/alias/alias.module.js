import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import ngOvhSidebarMenu from '@ovh-ux/ng-ovh-sidebar-menu';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';

import administration from './administration';
import changeType from './changeType';
import configuration from './configuration';
import consumption from './consumption';
import contact from './contact';
import dashboard from './dashboard';
import portability from './portability';
import records from './records';
import special from './special';
import statistics from './statistics';
import svaGenerator from './svaGenerator';

import routing from './alias.routing';

const moduleName = 'ovhManagerTelecomTelephonyAlias';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    ngOvhSidebarMenu,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
    administration,
    changeType,
    configuration,
    consumption,
    contact,
    dashboard,
    portability,
    records,
    special,
    statistics,
    svaGenerator,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
