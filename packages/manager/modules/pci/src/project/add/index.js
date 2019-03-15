import angular from 'angular';
import '@uirouter/angularjs';
import 'ovh-api-services';

import controller from './controller';
import template from './template.html';

const moduleName = 'ovhManagerPciProjectAdd';

angular
  .module(moduleName, [
    'ovh-api-services',
    'ui.router',
  ])
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider
      /**
       * NEW PROJECT
       * #/cloud/project/new (see "add" folder)
       */
      .state('iaas.pci-project-new', {
        url: '/pci/project/new',
        template,
        controller,
        controllerAs: 'CloudProjectAddCtrl',
        translations: {
          value: ['.'],
          format: 'json',
        },
      });
  });
// .config(/* @ngInject */(atInternetControllerDecoratorsProvider) => {
//   atInternetControllerDecoratorsProvider.decorate({
//     CloudProjectAddCtrl: {
//       createProject(atInternet, ctrl) {
//         if (ctrl.model.contractsAccepted && ctrl.data.agreements.length) {
//           atInternet.trackClick({
//             name: 'AccountActivation',
//             type: 'action',
//           });
//         }
//       },
//     },
//   });
// });

export default moduleName;
