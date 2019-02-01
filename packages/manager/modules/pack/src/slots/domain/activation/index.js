import angular from 'angular';
import '@uirouter/angularjs';
import '@ovh-ux/ng-ovh-telecom-universe-components';
import '@ovh-ux/ng-ovh-simple-country-list';
import 'angular-translate';
import 'angular-ui-bootstrap';
import 'ovh-api-services';
import 'ovh-ui-angular';

import controller from './controller';
import template from './template.html';

const moduleName = 'ovhManagerPackSlotsDomainActivation';

angular
  .module(moduleName, [
    'ngOvhSimpleCountryList',
    'oui',
    'ovh-api-services',
    'ngOvhTelecomUniverseComponents',
    'pascalprecht.translate',
    'ui.bootstrap',
    'ui.router',
  ])
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider.state('pack.domain-activation', {
      url: '/domain/activation',
      template,
      controller,
      controllerAs: '$ctrl',
      translations: ['.'],
    });
  });

export default moduleName;
