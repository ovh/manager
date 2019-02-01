import angular from 'angular';
import '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';
import 'ovh-ui-angular';

import add from './add';
import detail from './detail';
import component from './component';

const moduleName = 'ovhManagerPackSlotsHostedEmail';

angular
  .module(moduleName, [
    add,
    detail,
    'ngOvhTelecomUniverseComponents',
    'oui',
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.router',
  ])
  .component('packHostedEmailSlot', component);

export default moduleName;
