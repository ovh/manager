import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import 'ovh-api-services';
import '@ovh-ux/ui-kit';

import component from './add.component';
import routing from './add.routing';

import antiAffinity from '../../../components/anti-affinity';
import nodePool from '../../../components/node-pool';

const moduleName = 'ovhManagerPciProjectKubernetesNodePoolsAdd';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'oui',
    'ovh-api-services',
    'ui.router',
    'ngOvhCloudUniverseComponents',
    nodePool,
    antiAffinity,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .component('pciProjectKubernetesNodePoolsAddComponent', component);

export default moduleName;
