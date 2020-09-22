import routing from './cron.routing';

const moduleName = 'ovhManagerHostingCron';

angular
  .module(moduleName, [])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
