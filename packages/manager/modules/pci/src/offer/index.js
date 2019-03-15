import angular from 'angular';
import '@uirouter/angularjs';
import 'ovh-api-services';

import componentsProjectAdd from '../components/project/add';

import controller from './controller';
import template from './template.html';

// TODO : import './index.less';

const moduleName = 'ovhManagerPciOffer';

angular
  .module(moduleName, [
    'ovh-api-services',
    'ui.router',
    componentsProjectAdd,
  ])
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider
    /**
     * Onboarding of Cloud
     * #/cloud/offer (see "add" folder)
     */
      .state('iaas.pci-project-onboarding', {
        url: '/pci/offer?voucher',
        template,
        controller,
        controllerAs: 'CloudOfferCtrl',
        translations: {
          format: 'json',
          value: ['../project/add', '.'],
        },
      });
  });

export default moduleName;
