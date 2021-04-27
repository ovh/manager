import cdnConfiguration from './cdnConfiguration';

import statistics from './statistics/hosting-multisite-statistics.component';
import routing from './multisite.routing';

const moduleName = 'ovhManagerHostingMultisite';

angular
  .module(moduleName, [cdnConfiguration])
  .component('hostingMultisiteStatistics', statistics)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
