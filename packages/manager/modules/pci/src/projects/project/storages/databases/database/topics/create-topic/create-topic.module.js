import angular from 'angular';

import component from './create-topic.component';
import routing from './create-topic.routing';

const moduleName = 'ovhManagerPciStoragesDatabasesTopicsCreateTopic';

angular
  .module(moduleName, [])
  .config(routing)
  .component(
    'ovhManagerPciStoragesDatabaseTopicsCreateTopicComponent',
    component,
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
