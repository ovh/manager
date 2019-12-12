

// angular.module('managerApp')
//   .config(($stateProvider) => {
//     $stateProvider.state('deskaas.details', {
//       url: '/:serviceName?action&token',
//       templateUrl: 'app/deskaas/deskaas-details/deskaas-details.html',
//       controller: 'DeskaasDetailsCtrl',
//       controllerAs: '$ctrl',
//       translations: {
//         value: ['.'],
//         format: 'json',
//       },
//       params: {
//         followTask: null,
//       },
//     });
//   });
import angular from 'angular';
import component from './deskaas-details.component';
import routing from './deskaas-details.routing';
// import deskaasChangePassword from '../deskaas-change-password';

const moduleName = 'managerApp';

angular
  .module(moduleName)
  .config(routing)
  .component('deskaasDetailsComponent', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
