import angular from 'angular';
import '@uirouter/angularjs';
import 'ovh-api-services';
import 'ovh-ui-angular';

import component from './component';

const moduleName = 'ovhManagerPackSlotsXdslAccess';

angular
  .module(moduleName, [
    'oui',
    'ovh-api-services',
    'ui.router',
  ])
  .component('packXdslAccessSlot', component);

export default moduleName;
