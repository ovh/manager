import angular from 'angular';

import component from './scale.component';
import routing from './scale.routing';
import autoscaling from '../../../components/autoscaling';

const moduleName = 'ovhManagerPciProjectKubernetesNodePoolsScale';
angular
  .module(moduleName, [autoscaling])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .component('pciProjectKubernetesNodePoolsScaleComponent', component);

export default moduleName;
