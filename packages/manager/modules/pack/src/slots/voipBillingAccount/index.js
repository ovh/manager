import angular from 'angular';
import 'angular-translate';
import 'ovh-api-services';

import component from './component';

const moduleName = 'ovhManagerPackSlotsVoipBillingAccount';

angular
  .module(moduleName, [
    'ovh-api-services',
    'pascalprecht.translate',
  ])
  .component('packVoipBillingAccountSlot', component);

export default moduleName;
