import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';

import controller from './informations.controller';
import template from './informations.html';
import service from '../../orderFollowUp/orderFollowUp.service';

const moduleName = 'ovhManagerTelecomPackInformation';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
  ])
  .controller('PackInformationCtrl', controller)
  .service('OrderFollowUpService', service)
  .run(/* @ngTranslationsInject:json ./translations */)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'app/telecom/pack/slots/informations/informations.html',
        template,
      );
    },
  );

export default moduleName;
