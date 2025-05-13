import angular from 'angular';

import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ng-ovh-swimming-poll';
import '@ovh-ux/ui-kit';

import component from './topics.component';
import routing from './topics.routing';
import createTopic from './create-topic';
import deleteTopic from './delete-topic';

const moduleName = 'ovhManagerPciStoragesDatabasesTopics';

angular
  .module(moduleName, [
    'ngOvhCloudUniverseComponents',
    'ngOvhSwimmingPoll',
    'oui',
    createTopic,
    deleteTopic,
  ])
  .config(routing)
  .component('ovhManagerPciStoragesDatabaseTopicsComponent', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
