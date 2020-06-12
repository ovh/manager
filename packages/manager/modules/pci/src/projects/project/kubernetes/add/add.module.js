import angular from 'angular';

import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ng-ovh-swimming-poll';
import 'ovh-api-services';
import '@ovh-ux/ui-kit';

import regionsList from '../../../../components/project/regions-list';
import versionsList from './versions-list';

import component from './add.component';
import routing from './add.routing';

const moduleName = 'ovhManagerPciProjectKubernetesAdd';

angular
  .module(moduleName, [
    'ngOvhCloudUniverseComponents',
    'ngOvhSwimmingPoll',
    'oui',
    'ovh-api-services',
    regionsList,
    versionsList,
  ])
  .config(routing)
  .component('ovhManagerPciProjectKubernetesAdd', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
