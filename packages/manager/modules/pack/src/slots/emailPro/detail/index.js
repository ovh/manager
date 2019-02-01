import angular from 'angular';
import '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';
import 'ovh-ui-angular';

import controller from './controller';
import template from './template.html';

const moduleName = 'ovhManagerPackSlotsEmailProDetail';

angular
  .module(moduleName, [
    'ngOvhTelecomUniverseComponents',
    'oui',
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.router',
  ])
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider.state('pack.emailPro-detail', {
      url: '/xdsl-email/:serviceName/detail',
      template,
      controller,
      controllerAs: '$ctrl',
      translations: ['.'],
    });
  });

export default moduleName;
