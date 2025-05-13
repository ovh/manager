import angular from 'angular';
import managerCore from '@ovh-ux/manager-core';
import dedicatedUniverseComponents from '../dedicatedUniverseComponents';

import controller from './user-contracts.controller';
import modal from './modal';

const moduleName = 'UserContracts';

angular
  .module(moduleName, [dedicatedUniverseComponents, managerCore, modal])
  .controller('UserContractsCtrl', controller);

export default moduleName;
