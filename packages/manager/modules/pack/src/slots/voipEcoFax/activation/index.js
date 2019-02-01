import angular from 'angular';
import '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';

import controller from './controller';
import template from './template.html';

const moduleName = 'ovhManagerPackSlotsVoipEcoFaxActivation';

angular
  .module(moduleName, [
    'ngOvhTelecomUniverseComponents',
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.router',
  ])
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider.state('pack.voipEcoFax-activation', {
      url: '/voipEcoFax/activation',
      template,
      controller,
      controllerAs: 'PackFaxActivationCtrl',
      translations: ['.'],
    });
  });

export default moduleName;
