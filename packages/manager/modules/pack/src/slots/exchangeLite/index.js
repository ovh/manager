import angular from 'angular';
import 'ovh-api-services';
import 'ovh-ui-angular';

import component from './component';

const moduleName = 'ovhManagerPackSlotsExchangeLite';

angular
  .module(moduleName, [
    'oui',
    'ovh-api-services',
  ])
  .component('packExchangeLiteSlot', component);

export default moduleName;
