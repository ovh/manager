import '@uirouter/angularjs';
import routing from './data-streams.routing';
import component, { name } from './data-streams.component';

const moduleName = 'ovhManagerIplbLogsDataStreams';
angular
  .module(moduleName, ['ui.router'])
  .component(name, component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
