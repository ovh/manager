import angular from 'angular';
import '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import 'angular-translate';
import 'angular-ui-bootstrap';
import 'ovh-api-services';
import '@ovh-ux/ng-ovh-mondial-relay';

import controller from './controller';
import template from './template.html';

import './index.less';

const moduleName = 'ovhManagerPackSlotsVoipLineActivation';

angular
  .module(moduleName, [
    'ngOvhTelecomUniverseComponents',
    'ngOvhMondialRelay',
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.bootstrap',
    'ui.router',
  ])
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider.state('pack.voipLine-activation', {
      url: '/telephony/activation',
      template,
      controller,
      controllerAs: '$ctrl',
      translations: ['.'],
    });
  });

export default moduleName;
