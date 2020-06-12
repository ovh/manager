import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import 'ovh-api-services';
import '@ovh-ux/ui-kit';

import kubernetesComponent from './component';
import routing from './details.routing';
import service from './service';

import containersComponent from './containers/index';
import nodesComponent from './nodes';
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
    nodesComponent,
    serviceComponent,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .component(
    'ovhManagerPciProjectKubernetesDetailComponent',
    kubernetesComponent,
  )
  .service('Kubernetes', service);

export default moduleName;
