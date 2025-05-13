import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import 'angular-translate';

import template from './details.html';
import controller from './details.controller';

const moduleName = 'ovhManagerTelecomTelephonyLineDetails';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'pascalprecht.translate',
    'ui.router',
  ])
  .controller('TelecomTelephonyLineDetailsCtrl', controller)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'app/telecom/telephony/line/details/details.html',
        template,
      );
    },
  );

export default moduleName;
