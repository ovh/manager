import angular from 'angular';
import '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';
import 'ovh-ui-angular';

import controller from './controller';
import template from './template.html';

const moduleName = 'ovhManagerPackSlotsHubicActivation';

angular
  .module(moduleName, [
    'ngOvhTelecomUniverseComponents',
    'oui',
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.router',
  ])
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider.state('pack.hubic-activation', {
      url: '/hubic/activation',
      template,
      controller,
      controllerAs: 'PackHubicActivation',
      translations: ['.'],
    });
  });

export default moduleName;
