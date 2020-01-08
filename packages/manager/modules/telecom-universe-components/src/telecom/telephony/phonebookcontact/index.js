import angular from 'angular';

import { TELEPHONY_PHONEBOOK } from './phonebookcontact.constant';
import TucPhonebookcontact from './phonebookcontact.service';

const moduleName = 'tucTelecomTelephonyPhonebookcontact';
angular
  .module(moduleName, [])
  .constant('TUC_TELEPHONY_PHONEBOOK', TELEPHONY_PHONEBOOK)
  .service('TucPhonebookcontact', TucPhonebookcontact);

export default moduleName;
