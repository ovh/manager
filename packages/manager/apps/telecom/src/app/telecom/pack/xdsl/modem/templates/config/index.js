import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';

import routing from './templates-config.routing';
import modalTemplate from './modal/pack-xdsl-modem-template-config-modal.html';

const moduleName = 'ovhManagerTelecomPackXdslModemTemplateConfig';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'app/telecom/pack/xdsl/modem/templates/config/modal/pack-xdsl-modem-template-config-modal.html',
        modalTemplate,
      );
    },
  );

export default moduleName;
