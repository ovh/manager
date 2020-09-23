import routing from './dns-zone-tasks.routing';

const moduleName = 'ovhManagerWebDomainZoneTasks';

angular
  .module(moduleName, [])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
