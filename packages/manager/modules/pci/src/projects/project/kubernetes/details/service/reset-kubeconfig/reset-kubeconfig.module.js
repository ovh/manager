import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import 'ovh-api-services';
import '@ovh-ux/ui-kit';

import component from './reset-kubeconfig.component';
import routing from './reset-kubeconfig.routing';

const moduleName = 'ovhManagerPciProjectKubernetesServiceResetKubeconfig';

angular
  .module(moduleName, [
    'oui',
    'ovh-api-services',
    'pascalprecht.translate',
    'ngTranslateAsyncLoader',
    'ui.router',
  ])
  .config(routing)
  .component('pciProjectKubernetesServiceResetKubeconfig', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
