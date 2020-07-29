import angular from 'angular';

import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';
import '@ovh-ux/ui-kit';

import controller from './freefax-faxConfiguration.controller';
import template from './freefax-faxConfiguration.html';

const moduleName = 'managerFreefaxFaxConfiguration';

angular
  .module(moduleName, [
    'ngOvhTelecomUniverseComponents',
    'oui',
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.router',
  ])
  .controller('FreefaxConfigurationCtrl', controller)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'freefax/faxConfiguration/freefax-faxConfiguration.html',
        template,
      );
    },
  );

export default moduleName;
