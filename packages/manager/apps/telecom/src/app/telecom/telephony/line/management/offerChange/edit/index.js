import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import 'angular-translate';

import template from './edit.html';
import controller from './edit.controller';

const moduleName = 'ovhManagerTelecomTelephonyLineManagementOfferChangeEdit';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'pascalprecht.translate',
    'ui.router',
  ])
  .controller('TelecomTelephonyLineManagementOfferChangeEditCtrl', controller)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'app/telecom/telephony/line/management/offerChange/edit/edit.html',
        template,
      );
    },
  );

export default moduleName;
