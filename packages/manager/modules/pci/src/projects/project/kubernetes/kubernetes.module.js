import angular from 'angular';

import '@ovh-ux/ng-ovh-cloud-universe-components';
import 'ovh-api-services';
import 'ovh-ui-angular';

import component from './kubernetes.component';
import routing from './kubernetes.routing';
import service from './service';

import './index.scss';

const moduleName = 'ovhManagerPciProjectKubernetes';

angular.module(moduleName, [
  'ngOvhCloudUniverseComponents',
  'oui',
  'ovh-api-services',
])
  .config(routing)
  .component('ovhManagerPciProjectKubernetes', component)
  .service('PublicCloudProjectKubernetes', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
