import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import 'angular-translate';

import timeConditionConfigurationComponent from '../../../../../../components/telecom/telephony/service/time-condition-configuration';

import controller from './import.controller';
import template from './import.html';

const moduleName = 'ovhManagerTelecomTelephonyServiceTimeConditionImport';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'pascalprecht.translate',
    timeConditionConfigurationComponent,
  ])
  .controller('TelecomTelephonyServiceTimeConditionImportCtrl', controller)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        '/app/telecom/telephony/service/time-condition/import/import.html',
        // 'app/telecom/telephony/service/assist/logs/logs.html',
        template,
      );
    },
  );

export default moduleName;
