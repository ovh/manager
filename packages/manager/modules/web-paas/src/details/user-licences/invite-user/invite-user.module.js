import angular from 'angular';
import 'angular-translate';

import component from './invite-user.component';
import routing from './invite-user.routing';

const moduleName = 'ovhManagerWebPaasDetailsUserLicencesInviteUser';

angular
  .module(moduleName, ['pascalprecht.translate'])
  .config(routing)
  .component('webPaasDetailsUserLicencesInviteUser', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
