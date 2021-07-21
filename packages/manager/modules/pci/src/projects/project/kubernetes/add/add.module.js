import angular from 'angular';

import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ng-ovh-swimming-poll';
import 'ovh-api-services';
import '@ovh-ux/ui-kit';

import component from './add.component';
import regionsList from '../../../../components/project/regions-list';
import routing from './add.routing';
import versionsList from './versions-list';

import antiAffinity from '../components/anti-affinity';
import nodePool from '../components/node-pool';
import autoscaling from '../components/autoscaling';

const moduleName = 'ovhManagerPciProjectKubernetesAdd';

angular
  .module(moduleName, [
    'ngOvhCloudUniverseComponents',
    'ngOvhSwimmingPoll',
    'oui',
    'ovh-api-services',
    regionsList,
    versionsList,
    nodePool,
    antiAffinity,
    autoscaling,
  ])
  .config(routing)
  .component('ovhManagerPciProjectKubernetesAdd', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
