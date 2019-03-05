import angular from 'angular';
import '@uirouter/angularjs';
import 'ovh-api-services';

import consumption from './consumption';
import history from './history';
import rights from './rights';
import vouchers from './vouchers';

import controller from './controller';
import template from './template.html';

import './index.less';

const moduleName = 'ovhManagerPciProjectDetails';

angular
  .module(moduleName, [
    consumption,
    history,
    'ovh-api-services',
    rights,
    'ui.router',
    vouchers,
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
