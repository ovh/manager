import cdnFlush from './cdn-flush';

import statistics from './statistics/hosting-multisite-statistics.component';
import routing from './multisite.routing';

const moduleName = 'ovhManagerHostingMultisite';

angular
  .module(moduleName, [cdnFlush])
  .component('hostingMultisiteStatistics', statistics)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
