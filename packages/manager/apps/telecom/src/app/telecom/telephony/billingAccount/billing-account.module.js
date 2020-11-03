import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

import alias from '../alias';
import billingAccount from '.';
import carrierSip from '../carrierSip';
import fax from '../fax';
import line from '../line';

import abbreviatedNumbers from './abbreviatedNumbers';
import administration from './administration';
import billing from './billing';
import dashboard from './dashboard';
import guides from './guides';
import manageContacts from './manageContacts';
import orderAlias from './orderAlias';
import phonebook from './phonebook';
import services from './services';

import routing from './billingAccount.routing';

const moduleName = 'ovhManagerTelecomTelephonyBillingAccount';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
    alias,
    billingAccount,
    carrierSip,
    fax,
    line,

    abbreviatedNumbers,
    administration,
    billing,
    dashboard,
    guides,
    manageContacts,
    orderAlias,
    phonebook,
    services,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
