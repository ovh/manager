import angular from 'angular';

import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ui-kit';

import component from './add.component';
import routing from './add.routing';

import appConfiguration from './components/app-configuration';
import appResources from './components/app-resources';
import appAttach from './components/app-attach';
import appReview from './components/app-review';
import appImage from './components/app-image';
import ovhManagerPciStoragesContainers from '../../../storages/containers';

const moduleName = 'ovhManagerPciAiAppsAdd';

angular
  .module(moduleName, [
    'ngOvhCloudUniverseComponents',
    'oui',
    appConfiguration,
    appResources,
    appAttach,
    appReview,
    appImage,
    ovhManagerPciStoragesContainers,
  ])
  .config(routing)
  .component(moduleName, component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
