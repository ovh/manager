import cdnConfiguration from './cdnConfiguration';

import routing from './multisite.routing';

const moduleName = 'ovhManagerHostingMultisite';

angular
  .module(moduleName, [cdnConfiguration])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
