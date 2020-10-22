import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';

import './order-alias.less';

import geographical from './geographical';
import international from './international';
import nonGeographical from './nonGeographical';
import special from './special';

import routing from './order-alias.routing';
import service from './order-alias.service';

const moduleName = 'ovhManagerTelecomTelephonyBillingAccountOrderAlias';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
    geographical,
    international,
    nonGeographical,
    special,
  ])
  .config(routing)
  .service('TelecomTelephonyBillingAccountOrderAliasService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
