import angular from 'angular';
import 'angular-translate';

import component from './user-licences.component';
import routing from './user-licences.routing';
import inviteUser from './invite-user';
import deleteUser from './delete-user';
import userList from '../../components/user-list';
import addAddon from './add-addon';

const moduleName = 'ovhManagerWebPaasDetailsUserLicences';

angular
  .module(moduleName, [
    'pascalprecht.translate',
    addAddon,
    deleteUser,
    inviteUser,
    userList,
  ])
  .config(routing)
  .component('webPaasDetailsUserLicences', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
