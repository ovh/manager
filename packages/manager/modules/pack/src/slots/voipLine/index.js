import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';
import 'ovh-ui-angular';

import activation from './activation';
import component from './component';

const moduleName = 'ovhManagerPackSlotsVoipLine';

angular
  .module(moduleName, [
    activation,
    'oui',
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.router',
  ])
  .component('packVoipLineSlot', component);

export default moduleName;
