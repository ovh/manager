import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';
import 'ovh-ui-angular';

import add from './add';
import detail from './detail';
import component from './component';

const moduleName = 'ovhManagerPackSlotsEmailPro';

angular
  .module(moduleName, [
    add,
    detail,
    'oui',
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.router',
  ])
  .component('packEmailProSlot', component);

export default moduleName;
