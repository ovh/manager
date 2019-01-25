import angular from 'angular';

import '@ovh-ux/manager-telecom-styles';

import abbreviatedNumbers from './abbreviatedNumbers';
import administration from './administration';
import billing from './billing';
import dashboard from './dashboard';
import guides from './guides';
import manageContacts from './manageContacts';
import phonebook from './phonebook';

import routing from './telecom-telephony-billing-account.routes';

const moduleName = 'ovhManagerTelephony.billingAccount';

angular
  .module(moduleName, [
    abbreviatedNumbers,
    administration,
    billing,
    dashboard,
    guides,
    manageContacts,
    phonebook,
  ])
  .config(routing);

export default moduleName;
