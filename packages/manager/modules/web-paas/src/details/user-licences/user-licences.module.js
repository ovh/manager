import angular from 'angular';
import 'angular-translate';

import component from './user-licences.component';
import routing from './user-licences.routing';
import inviteUser from './invite-user';
import deleteUser from './delete-user';

const moduleName = 'ovhManagerWebPaasDetailsUserLicences';

angular
  .module(moduleName, ['pascalprecht.translate', deleteUser, inviteUser])
  .config(routing)
  .component('webPaasDetailsUserLicences', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
