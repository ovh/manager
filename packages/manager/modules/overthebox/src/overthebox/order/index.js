import angular from 'angular';
import '@ovh-ux/ng-ovh-contracts';

import component from './order-overTheBox.component';
import routing from './order-overTheBox.routing';

import ovhManagerOtbWarning from '../warning';

const moduleName = 'ovhManagerOtbOrder';

angular
  .module(moduleName, ['ngOvhContracts', ovhManagerOtbWarning])
  .component('overTheBoxOrder', component)
  .config(routing);

export default moduleName;
