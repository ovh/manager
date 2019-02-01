import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';
import 'ovh-ui-angular';

import add from './add';
import component from './component';

const moduleName = 'ovhManagerPackSlotsExchangeIndividual';

angular
  .module(moduleName, [
    add,
    'oui',
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.router',
  ])
  .component('packExchangeIndividualSlot', component);

export default moduleName;
