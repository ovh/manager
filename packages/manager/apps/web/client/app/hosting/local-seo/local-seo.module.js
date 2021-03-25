import routing from './local-seo.routing';

const moduleName = 'ovhManagerHostingLocalSEO';

angular
  .module(moduleName, [])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
