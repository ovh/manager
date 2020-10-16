import angular from 'angular';

import component from './add.component';
import billingType from '../../../../components/billing-type';
import routing from './add.routing';

const moduleName = 'ovhManagerPciProjectKubernetesNodesAdd';

angular
  .module(moduleName, [billingType])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .component('pciProjectKubernetesNodesAddComponent', component);

export default moduleName;
