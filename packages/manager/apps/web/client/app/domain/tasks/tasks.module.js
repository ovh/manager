import routing from './domain-tasks.state';

const moduleName = 'ovhManagerWebDomainTasksModule';

angular
  .module(moduleName, [])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
