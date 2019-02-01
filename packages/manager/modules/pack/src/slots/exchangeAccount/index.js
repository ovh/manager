import angular from 'angular';
import 'ovh-api-services';
import 'ovh-ui-angular';

import component from './component';

const moduleName = 'ovhManagerPackSlotsExchangeAccount';

angular
  .module(moduleName, [
    'oui',
    'ovh-api-services',
  ])
  .component('packExchangeAccountSlot', component);

export default moduleName;
