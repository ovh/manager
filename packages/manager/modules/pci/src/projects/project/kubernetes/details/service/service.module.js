import angular from 'angular';
import 'angular-translate';

import routing from './service.routing';

import name from './edit-name';
import reset from './reset';
import resetKubeconfig from './reset-kubeconfig';
import terminate from './terminate';
import update from './update';
import upgradePolicy from './upgrade-policy';

import kubernetesServiceComponent from './service.component';

const moduleName = 'ovhManagerPciProjectKubernetesService';

angular
  .module(moduleName, [
    'pascalprecht.translate',
    name,
    reset,
    resetKubeconfig,
    terminate,
    update,
    upgradePolicy,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .component(
    'ovhManagerPciProjectKubernetesServiceComponent',
    kubernetesServiceComponent,
  );

export default moduleName;
