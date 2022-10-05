import angular from 'angular';

import add from './vsphere-users/add';
import deleteUser from './vsphere-users/delete';
import disable from './vsphere-users/disable';
import edit from './vsphere-users/edit';
import enable from './vsphere-users/enable';
import federationAdd from './activeDirectories/add';
import federationDelete from './activeDirectories/delete';
import federationEdit from './activeDirectories/edit';
import importUser from './vsphere-users/import';
import passwordReset from './vsphere-users/password-reset';
import rights from './vsphere-users/rights';
import routing from './users.routes';
import userComponent from '../../components/dedicated-cloud/users';

const moduleName = 'managedBaremetalUsersModule';

angular
  .module(moduleName, [
    add,
    deleteUser,
    disable,
    edit,
    enable,
    federationAdd,
    federationDelete,
    federationEdit,
    importUser,
    passwordReset,
    rights,
    userComponent,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
