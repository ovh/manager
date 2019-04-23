import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';

import controller from './controller';
import template from './template.html';

const moduleName = 'ovhManagerPciProjectAdd';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.router',
  ])
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider
      /**
       * NEW PROJECT
       * #/cloud/project/new (see "add" folder)
       */
      .state('pci.project-new', {
        url: '/pci/project/new',
        template,
        controller,
        controllerAs: 'CloudProjectAddCtrl',
      });
  })
  .run(/* @ngTranslationsInject:json ./translations */);
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
