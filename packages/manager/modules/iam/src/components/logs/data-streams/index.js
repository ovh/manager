import component, { name } from './data-streams.component';

const moduleName = 'ovhManagerIAMLogsDataStreams';
angular
  .module(moduleName, [])
  .component(name, component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
