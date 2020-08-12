import angular from 'angular';
import ovhManagerCore from '@ovh-ux/manager-core';
import 'angular-route';
import 'angular-ui-bootstrap';
import 'ng-ckeditor';
import '@ovh-ux/ng-ovh-utils';
import '@ovh-ux/ng-ovh-web-universe-components';
import 'moment';

import 'ovh-ui-kit-bs/dist/css/oui-bs3.css';

import ExchangeAccountMfaCreate from '../account/mfa/create';
import ExchangeAccountMfaDelete from '../account/mfa/delete';

import components from './exchangeComponents.module';
import controllers from './exchangeControllers.module';
import directives from './exchangeDirectives.module';
import services from './exchangeServices.module';
import routing from './exchange.routes';
import cacheTemplate from './exchange.template';

import {
  EXCHANGE_MX_CONFIG,
  EXCHANGE_CONFIG_URL,
  EXCHANGE_CONFIG,
} from './exchange.constants';

import '../css/exchangeDiagnostic.css';

const moduleName = 'Module.exchange';

angular
  .module(moduleName, [
    'ngOvhUtils',
    'ngRoute',
    'ui.bootstrap',
    'ngSanitize',
    'ng.ckeditor',
    'ngOvhWebUniverseComponents',
    components,
    controllers,
    directives,
    ovhManagerCore,
    services,
    ExchangeAccountMfaCreate,
    ExchangeAccountMfaDelete,
  ])
  .constant('EXCHANGE_MX_CONFIG', EXCHANGE_MX_CONFIG)
  .constant('EXCHANGE_CONFIG_URL', EXCHANGE_CONFIG_URL)
  .constant('EXCHANGE_CONFIG', EXCHANGE_CONFIG)
  .config(routing)
  .run(cacheTemplate)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
