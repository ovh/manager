import angular from 'angular';
import angularTranslate from 'angular-translate';
import ngAtInternet from '@ovh-ux/ng-at-internet';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';
import uiRouter from '@uirouter/angularjs';
import ovhManagerBillingComponents from '@ovh-ux/manager-billing-components';
import ovhManagerCore from '@ovh-ux/manager-core';

import activation from './actions/activation/activation.module';
import agreements from './agreements/user-agreements.module';
import autorenewBlocked from './actions/autorenew-blocked/autorenew-blocked.module';
import bulk from './bulk/bulk.module';
import cancelCommitment from './cancel-commitment';
import cancelResiliation from './cancel-resiliation';
import commitment from './commitment';
import debtBeforePaying from './actions/debtBeforePaying/debtBeforePaying.module';
import deleteModule from './actions/delete/delete.module';
import disable from './disable/disable.module';
import disableDomainsBulk from './disable-domains-bulk/disable-domains-bulk.module';
import exchangeRenew from './actions/exchange/exchange-renew.module';
import enable from './enable/enable.module';
import resiliation from './resiliation';
import ssh from './ssh/ssh.module';
import terminate from './actions/terminate/terminate.module';
import terminateEmail from './actions/terminateEmail/email.module';
import terminateEnterpriseCloudDatabase from './actions/terminate-enterprise-cloud-database/terminate-enterprise-cloud-database.module';
import terminateHostingWeb from './actions/terminateHostingWeb/hosting-web.module';
import terminatePrivateDatabase from './actions/terminatePrivateDatabase/private-database.module';
import terminateWebCoach from './actions/terminate-webcoach/terminate-webcoach.module';
import update from './actions/update/update.module';
import warnNicBilling from './actions/warnNicBilling/warnNicBilling.module';
import warnPendingDebt from './actions/warnPendingDebt/pending-debt.module';

import component from './autorenew.component';
import routing from './autorenew.routing';
import service from './autorenew.service';

const moduleName = 'ovhManagerBillingAutorenew';

angular
  .module(moduleName, [
    activation,
    agreements,
    angularTranslate,
    autorenewBlocked,
    bulk,
    cancelCommitment,
    cancelResiliation,
    commitment,
    debtBeforePaying,
    deleteModule,
    disable,
    disableDomainsBulk,
    exchangeRenew,
    enable,
    ngAtInternet,
    ngTranslateAsyncLoader,
    ovhManagerBillingComponents,
    ovhManagerCore,
    'oui',
    resiliation,
    ssh,
    terminate,
    terminateEmail,
    terminateEnterpriseCloudDatabase,
    terminateHostingWeb,
    terminatePrivateDatabase,
    terminateWebCoach,
    uiRouter,
    update,
    warnNicBilling,
    warnPendingDebt,
  ])
  .config(routing)
  .component('autoRenew', component)
  .service('BillingAutoRenew', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
