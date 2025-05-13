import routing from './ftp.routing';

const moduleName = 'ovhManagerHostingFTP';

angular
  .module(moduleName, [])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
