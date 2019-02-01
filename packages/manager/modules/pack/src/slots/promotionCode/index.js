import angular from 'angular';
import '@ovh-ux/ng-ovh-telecom-universe-components';
import 'angular-translate';
import 'angular-ui-bootstrap';
import 'ovh-api-services';

import component from './component';

const moduleName = 'ovhManagerPackSlotsPromotionCode';

angular
  .module(moduleName, [
    'ngOvhTelecomUniverseComponents',
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.bootstrap',
  ])
  .component('packPromotionCodeSlot', component);

export default moduleName;
