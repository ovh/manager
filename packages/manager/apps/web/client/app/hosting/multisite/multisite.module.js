import cdnFlush from './cdn-flush';

import statistics from './statistics/hosting-multisite-statistics.component';
import hostingMultisiteGitAssociation from './git-integration/association';
import hostingMultisiteGitRemoval from './git-integration/removal';
import hostingMultisiteGitDeployment from './git-integration/deployment';
import hostingMultisiteGitViewLastDeployment from './git-integration/view-last-deployment';
import routing from './multisite.routing';

const moduleName = 'ovhManagerHostingMultisite';

angular
  .module(moduleName, [
    cdnFlush,
    hostingMultisiteGitAssociation,
    hostingMultisiteGitDeployment,
    hostingMultisiteGitRemoval,
    hostingMultisiteGitViewLastDeployment,
  ])
  .component('hostingMultisiteStatistics', statistics)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
