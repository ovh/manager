import angular from 'angular';

import component from './delete-topic.component';
import routing from './delete-topic.routing';

const moduleName = 'ovhManagerPciStoragesDatabaseTopicsDeleteTopic';

angular
  .module(moduleName, [])
  .config(routing)
  .component(
    'ovhManagerPciStoragesDatabaseTopicsDeleteTopicComponent',
    component,
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
