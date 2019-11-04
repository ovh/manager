import angular from 'angular';

import '@ovh-ux/ng-ovh-telecom-universe-components';
import '@ovh-ux/manager-telecom-styles';
import '@ovh-ux/ng-ui-router-title';
import 'ovh-angular-ui-confirm-modal';
import 'ovh-api-services';

import 'ovh-ui-kit/dist/oui.css';
import 'ovh-ui-kit-bs/dist/ovh-ui-kit-bs.css';

import credit from './credit';
import faxConfiguration from './faxConfiguration';
import notifications from './notifications';
import voicemailConfiguration from './voicemailConfiguration';

import controller from './freefax.controller';
import template from './freefax.html';
import freeFaxInformations from './information/freeFax-information.html';

import './freefax.scss';

export default angular
  .module('OvhManagerFreefaxComponent', [
    'ovh-api-services',
    'ngOvhTelecomUniverseComponents',
    'ui.router',
    'ovh-angular-ui-confirm-modal',
    'ngUiRouterTitle',
    credit,
    faxConfiguration,
    notifications,
    voicemailConfiguration,
  ])
  .component('ovhManagerFreefaxComponent', {
    template,
    controller,
    controllerAs: 'FreeFax',
  })
  .run(/* @ngInject */ ($templateCache) => {
    // import templates required by ng-include
    $templateCache.put('freefax/information/freefax-information.html', freeFaxInformations);
  })
  .config(($stateProvider) => {
    $stateProvider.state('freefax', {
      url: '/freefax/:serviceName',
      translations: {
        value: ['.'],
        format: 'json',
      },
      resolve: {
        $title(translations, $translate, $stateParams) {
          return $translate.instant('freefax_page_title', { name: $stateParams.serviceName }, null, null, 'escape');
        },
      },
      component: 'ovhManagerFreefaxComponent',
    });
  });
