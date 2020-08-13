import angular from 'angular';
import ovhManagerCore from '@ovh-ux/manager-core';
import 'angular-route';
import 'angular-ui-bootstrap';
import 'bootstrap';
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

import information from '../information/information.module';
import domain from '../domain/domain.module';
import account from '../account/account.module';
import group from '../group/group.module';
import externalContact from '../external-contact/external-contact.module';
import sharedAccount from '../shared-account/shared-account.module';
import diagnostic from '../diagnostic/diagnostic.module';
import security from '../security/security.module';
import resource from '../resource/resource.module';
import disclaimer from '../disclaimer/disclaimer.module';
import shared from '../shared/shared.module';
import task from '../task/task.module';

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
    information,
    domain,
    account,
    group,
    externalContact,
    sharedAccount,
    diagnostic,
    security,
    resource,
    disclaimer,
    shared,
    task,
  ])
  .constant('EXCHANGE_MX_CONFIG', EXCHANGE_MX_CONFIG)
  .constant('EXCHANGE_CONFIG_URL', EXCHANGE_CONFIG_URL)
  .constant('EXCHANGE_CONFIG', EXCHANGE_CONFIG)
  .config(routing)
  .run(cacheTemplate)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
