import cdnFlush from './cdn-flush';

import statistics from './statistics/hosting-multisite-statistics.component';
import routing from './multisite.routing';
import multisiteDiagnosticCtrl from './diagnostic/dialog.controller';

const moduleName = 'ovhManagerHostingMultisite';

angular
  .module(moduleName, [cdnFlush])
  .component('hostingMultisiteStatistics', statistics)
  .config(routing)
  .controller('MultisiteDiagnosticCtrl', multisiteDiagnosticCtrl)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
