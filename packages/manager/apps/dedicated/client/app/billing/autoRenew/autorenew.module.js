import ovhManagerBilling from '@ovh-ux/manager-billing';

import activation from './actions/activation/activation.module';
import agreements from './agreements/user-agreements.module';
import cancelResiliation from './actions/cancel-resiliation/cancel-resiliation.module';
import debtBeforePaying from './actions/debtBeforePaying/debtBeforePaying.module';
import deleteModule from './actions/delete/delete.module';
import disable from './disable/disable.module';
import disableDomainsBulk from './disable-domains-bulk/disable-domains-bulk.module';
import exchangeRenew from './actions/exchange/exchange-renew.module';
import enable from './enable/enable.module';
import ssh from './ssh/ssh.module';
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
    ovhManagerBilling,
    'ui.router',
    activation,
    agreements,
    cancelResiliation,
    debtBeforePaying,
    deleteModule,
    disable,
    disableDomainsBulk,
    exchangeRenew,
    enable,
    ssh,
    terminateEmail,
    terminateEnterpriseCloudDatabase,
    terminateHostingWeb,
    terminatePrivateDatabase,
    terminateWebCoach,
    update,
    warnNicBilling,
    warnPendingDebt,
  ])
  .config(routing)
  .component('autoRenew', component)
  .service('BillingAutoRenew', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
