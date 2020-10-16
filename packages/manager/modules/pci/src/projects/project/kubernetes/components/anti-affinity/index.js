import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './anti-affinity.component';

const moduleName = 'ovhManagerPciProjectKubernetesNodePoolAntiAffinity';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .component('nodePoolAntiAffinity', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
