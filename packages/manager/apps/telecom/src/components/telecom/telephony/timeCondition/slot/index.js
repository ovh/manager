import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';

import serviceChoiceModule from '../../service/choice';

import component from './slot.component';

import editTemplate from './edit/edit.html';
import editController from './edit/edit.controller';

const moduleName =
  'ovhManagerTelecomComponentsTelecomTelephonyTimeConditionSlot';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
    serviceChoiceModule,
  ])
  .component('voipTimeConditionSlot', component)
  .controller('voipTimeConditionSlotEditCtrl', editController)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'components/telecom/telephony/timeCondition/slot/edit/edit.html',
        editTemplate,
      );
    },
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
