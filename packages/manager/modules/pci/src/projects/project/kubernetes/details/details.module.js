import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import 'ovh-api-services';
import '@ovh-ux/ui-kit';

import kubernetesComponent from './component';
import routing from './details.routing';

import containersComponent from './containers/index';
import nodePools from './node-pool';
import serviceComponent from './service/index';

import './index.scss';

const moduleName = 'ovhManagerPciProjectKubernetesDetailComponent';

angular
  .module(moduleName, [
    'ngOvhCloudUniverseComponents',
    'oui',
    'ovh-api-services',
    'pascalprecht.translate',
    'ngTranslateAsyncLoader',
    'ui.router',
    containersComponent,
    nodePools,
    serviceComponent,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .component(
    'ovhManagerPciProjectKubernetesDetailComponent',
    kubernetesComponent,
  );

export default moduleName;
