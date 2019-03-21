import angular from 'angular';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';

import controller from './controller';
import template from './template.html';

const moduleName = 'ovhManagerPciProjectDetails';

angular
  .module(moduleName, [
    'ovh-api-services',
    'ui.router',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider.state('iaas.pci-project.details', {
      url: '',
      views: {
        cloudProject: {
          template,
          controller,
          controllerAs: 'CloudProjectDetailsCtrl',
        },
      },
      params: {
        fromProjectAdd: { // used in CloudProjectAddCtrl
          value: false,
          squash: true,
        },
        createNewVm: false,
      },
    });
  })
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
