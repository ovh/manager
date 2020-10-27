import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';

import slot from '../slot';

import editTemplate from './edit/edit.html';
import editController from './edit/edit.controller';

const moduleName =
  'ovhManagerTelecomComponentsTelecomTelephonyTimeConditionCondition';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
    slot,
  ])
  .controller('voipTimeConditionConditionCtrl', editController)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'components/telecom/telephony/timeCondition/condition/edit/edit.html',
        editTemplate,
      );
    },
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
