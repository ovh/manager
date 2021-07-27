import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './autoscaling.component';

const moduleName = 'ovhManagerPciProjectKubernetesNodePoolAutoscaling';

angular
  .module(moduleName, [
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .component('nodePoolAutoscaling', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
