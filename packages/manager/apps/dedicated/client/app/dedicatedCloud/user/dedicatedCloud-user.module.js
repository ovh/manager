import angular from 'angular';

import add from './add';
import deleteUser from './delete';
import disable from './disable';
import edit from './edit';
import enable from './enable';
import passwordReset from './password-reset';
import rights from './rights';
import routing from './dedicatedCloud-user.routes';
import userComponent from '../../components/dedicated-cloud/user';

const moduleName = 'dedicatedCloudUserModule';

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
  .config(routing);

export default moduleName;
