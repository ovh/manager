import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';

import timeConditionComponent from '../../timeCondition';

import popupTemplate from './events-popup.html';
import component from './events.component';

const moduleName = 'ovhManagerTelecomComponentsTelecomTelephonySchedulerEvents';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
    timeConditionComponent,
  ])
  .component('telephonySchedulerEvents', component)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'components/telecom/telephony/scheduler/events/events-popup.html',
        popupTemplate,
      );
    },
  );

export default moduleName;
