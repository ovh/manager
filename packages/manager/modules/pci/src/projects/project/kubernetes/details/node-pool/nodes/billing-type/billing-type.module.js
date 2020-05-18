import angular from 'angular';

import component from './billing-type.component';
import routing from './billing-type.routing';

const moduleName = 'ovhManagerPciProjectsProjectKubernetesNodesBillingType';

angular
  .module(moduleName, [])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .component(
    'pciProjectsProjectKubernetesNodesBillingTypeComponent',
    component,
  );

export default moduleName;
