import angular from 'angular';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';
import 'ovh-ui-angular';

import componentsProjectAdd from '../components/project/add';

import controller from './controller';
import template from './template.html';

const moduleName = 'ovhManagerPciOffer';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.router',
    componentsProjectAdd,
  ])
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider
    /**
     * Onboarding of Cloud
     * #/cloud/offer (see "add" folder)
     */
      .state('pci.project-onboarding', {
        url: '/pci/offer?voucher',
        template,
        controller,
        controllerAs: 'CloudOfferCtrl',
      });
  })
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
