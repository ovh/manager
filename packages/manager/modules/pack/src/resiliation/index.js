import angular from 'angular';
import '@uirouter/angularjs';
import '@ovh-ux/ng-ovh-telecom-universe-components';
import 'angular-translate';
import 'angular-ui-bootstrap';
import 'ovh-angular-ui-confirm-modal';
import 'ovh-api-services';

import controller from './controller';
import template from './template.html';

import './index.less';

const moduleName = 'ovhManagerPackResiliation';

angular
  .module(moduleName, [
    'ngOvhTelecomUniverseComponents',
    'ovh-angular-ui-confirm-modal',
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.bootstrap',
    'ui.router',
  ])
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider.state('pack.resiliation', {
      url: '/resiliation',
      template,
      controller,
      controllerAs: '$ctrl',
      translations: ['.'],
    });
  });

export default moduleName;
