import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';

import controller from './hubic.controller';
import template from './hubic.html';

const moduleName = 'ovhManagerTelecomPackHubic';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
  ])
  .controller('PackHubicCtrl', controller)
  .run(/* @ngTranslationsInject:json ./translations */)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put('app/telecom/pack/slots/hubic/hubic.html', template);
    },
  );

export default moduleName;
