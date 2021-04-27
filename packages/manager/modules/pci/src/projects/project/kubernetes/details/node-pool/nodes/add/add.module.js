import angular from 'angular';

import component from './add.component';
import routing from './add.routing';
import autoscaling from '../../../../components/autoscaling';

const moduleName = 'ovhManagerPciProjectKubernetesNodesAdd';

angular
  .module(moduleName, [autoscaling])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .component('pciProjectKubernetesNodesAddComponent', component);

export default moduleName;
