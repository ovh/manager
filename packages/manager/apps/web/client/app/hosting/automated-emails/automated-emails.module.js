import routing from './automated-emails.routing';

const moduleName = 'ovhManagerHostingAutomatedEmails';

angular
  .module(moduleName, [])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
