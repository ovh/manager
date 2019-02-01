import angular from 'angular';
import '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import 'angular-translate';
import 'angular-ui-bootstrap';
import 'ovh-api-services';
import 'ovh-ui-angular';
// TODO add https://github.com/ovh-ux/ovh-angular-input-password

import controller from './controller';
import template from './template.html';

const moduleName = 'ovhManagerPackSlotsHostedEmailDetail';

angular
  .module(moduleName, [
    'ngOvhTelecomUniverseComponents',
    'oui',
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.bootstrap',
    'ui.router',
  ])
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider.state('pack.hostedEmail-detail', {
      url: '/hostedEmail/:serviceName/detail',
      template,
      controller,
      controllerAs: '$ctrl',
      translations: ['.'],
    });
  });

export default moduleName;
