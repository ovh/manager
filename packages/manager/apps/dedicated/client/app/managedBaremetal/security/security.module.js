import angular from 'angular';

import add from './add';
import addKms from './kms/add';
import datacenterSecurityComponent from '../../components/dedicated-cloud/security';
import deleteKms from './kms/delete';
import deleteSecurity from './delete';
import editKms from './kms/edit';
import routing from './security.routes';
import logout from './logout';
import sessionTimeoutUpdate from './session-timeout/update';
import simultaneousConnectionUpdate from './simultaneous-connection/update';
import update from './update';

const moduleName = 'managedBaremetalSecurityModule';

angular
  .module(moduleName, [
    add,
    addKms,
    datacenterSecurityComponent,
    deleteKms,
    deleteSecurity,
    editKms,
    logout,
    sessionTimeoutUpdate,
    simultaneousConnectionUpdate,
    update,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
