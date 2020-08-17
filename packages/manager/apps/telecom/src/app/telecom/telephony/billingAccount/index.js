import angular from 'angular';

import guides from './guides';
import administrationPortabilities from './administration/portabilities/portabilities.module';
import services from './services';

import routing from './billingAccount.routing';
import service from './billingAccount.service';

const moduleName = 'ovhManagerTelecomTelephonyBillingAccount';

angular
  .module(moduleName, [administrationPortabilities, guides, services])
  .config(routing)
  .service('telecomBillingAccount', service);

export default moduleName;
