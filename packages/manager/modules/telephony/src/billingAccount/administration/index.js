import angular from 'angular';

import addGroup from './addGroup';
import deleteGroup from './deleteGroup';
import linesGroup from './linesGroup';
import optionsGroup from './optionsGroup';

import routing from './billing-account-administration.routes';

const moduleName = 'ovhManagerTelephony.billingAccount.administration';

angular
  .module(moduleName, [addGroup, deleteGroup, linesGroup, optionsGroup])
  .config(routing);

export default moduleName;
