import angular from 'angular';
import '@uirouter/angularjs';
import 'ovh-api-services';

import controller from './controller';
import template from './template.html';

// TODO : import './index.less';

const moduleName = 'ovhManagerPciProjectDetails';

angular
  .module(moduleName, [
    'ovh-api-services',
    'ui.router',
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
      translations: {
        value: ['.'],
        format: 'json',
      },
    });
  });

export default moduleName;
