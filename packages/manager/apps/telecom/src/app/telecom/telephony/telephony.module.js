import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

import telephonyComponents from '../../../components/telecom/telephony';

import alias from './alias';
import billingAccount from './billingAccount';
import carrierSip from './carrierSip';
import dashboard from './dashboard/dashboard.module';
import fax from './fax';
import line from './line';

import component from './telephony.component';
import routing from './telephony.routing';

const moduleName = 'ovhManagerTelecomTelephony';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
    telephonyComponents,
    alias,
    billingAccount,
    carrierSip,
    dashboard,
    fax,
    line,
    carrierSip,
  ])
  .config(routing)
  .component('telecomTelephony', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
