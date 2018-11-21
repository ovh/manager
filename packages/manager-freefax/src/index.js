import angular from 'angular';

import '@ovh-ux/manager-core';
import '@uirouter/angularjs';
import 'ovh-angular-contracts';
import 'ovh-api-services';

import freeFaxInformations from './information/freeFax-information.html';

import controller from './freefax.controller';
import template from './freefax.html';

import credit from './credit';
import faxConfiguration from './faxConfiguration';
import notifications from './notifications';
import voicemailConfiguration from './voicemailConfiguration';

const moduleName = 'ovhManagerFreeFax';

angular
  .module(moduleName, [
    'ovh-api-services',
    'ovhManagerCore',
    'telecomUniverseComponents',
    'ui.router',
    'ovh-angular-contracts',
    credit,
    faxConfiguration,
    notifications,
    voicemailConfiguration,
  ])
  .run(/* @ngInject */ ($templateCache) => {
    // import templates required by ng-include
    $templateCache.put('freefax/information/freefax-information.html', freeFaxInformations);
  })
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider.state('freefax', {
      url: '/freefax/:serviceName',
      controller,
      controllerAs: 'FreeFax',
      template,
      translations: ['.'],
      // resolve: {
      //   $title(translations, $translate, $stateParams) {
      //     return $translate.instant('freefax_page_title',
      // { name: $stateParams.serviceName }, null, null, 'escape');
      //   },
      // },
    });
  });

export default moduleName;
