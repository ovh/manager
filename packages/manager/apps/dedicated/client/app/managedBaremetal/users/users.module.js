import angular from 'angular';

import add from './vsphere-users/add';
import deleteUser from './vsphere-users/delete';
import disable from './vsphere-users/disable';
import edit from './vsphere-users/edit';
import enable from './vsphere-users/enable';
import iamToggle from './iam/toggle';
import federationAdd from './activeDirectories/add';
import federationDelete from './activeDirectories/delete';
import federationEdit from './activeDirectories/edit';
import userIamRole from './vsphere-users/iam-role';
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
    iamToggle,
    federationAdd,
    federationDelete,
    federationEdit,
    userIamRole,
    importUser,
    passwordReset,
    rights,
    userComponent,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
