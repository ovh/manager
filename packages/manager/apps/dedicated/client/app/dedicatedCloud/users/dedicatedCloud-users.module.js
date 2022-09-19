import angular from 'angular';

import add from './vsphere-users/add';
import deleteUser from './vsphere-users/delete';
import disable from './vsphere-users/disable';
import edit from './vsphere-users/edit';
import enable from './vsphere-users/enable';
import passwordReset from './vsphere-users/password-reset';
import rights from './vsphere-users/rights';
import routing from './dedicatedCloud-users.routes';
import userComponent from '../../components/dedicated-cloud/users';

const moduleName = 'dedicatedCloudUsersModule';

angular
  .module(moduleName, [
    add,
    deleteUser,
    disable,
    edit,
    enable,
    passwordReset,
    rights,
    userComponent,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
