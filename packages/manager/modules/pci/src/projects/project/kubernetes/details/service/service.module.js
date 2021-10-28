import angular from 'angular';
import 'angular-translate';

import routing from './service.routing';

import name from './edit-name';
import reset from './reset';
import resetKubeconfig from './reset-kubeconfig';
import terminate from './terminate';
import update from './update';
import addOidcProvider from './oidc-provider/add-oidc-provider';
import updateOidcProvider from './oidc-provider/update-oidc-provider';
import removeOidcProvider from './oidc-provider/remove-oidc-provider';
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
    addOidcProvider,
    updateOidcProvider,
    removeOidcProvider,
    upgradePolicy,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .component(
    'ovhManagerPciProjectKubernetesServiceComponent',
    kubernetesServiceComponent,
  );

export default moduleName;
