import angular from 'angular';
import 'angular-translate';

import component from './delete-user.component';
import routing from './delete-user.routing';

const moduleName = 'ovhManagerWebPaasDetailsUserLicencesDeleteUser';

angular
  .module(moduleName, ['pascalprecht.translate'])
  .config(routing)
  .component('webPaasDetailsUserLicencesDeleteUser', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
