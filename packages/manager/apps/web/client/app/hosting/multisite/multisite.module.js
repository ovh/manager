import cdnFlush from './cdn-flush';

import hostingMultisiteGitAssociation from './git-integration/association';
import hostingMultisiteGitRemoval from './git-integration/removal';
import hostingMultisiteGitDeployment from './git-integration/deployment';
import hostingMultisiteGitViewLastDeployment from './git-integration/view-last-deployment';
import routing from './multisite.routing';
import multisiteDiagnosticCtrl from './diagnostic/dialog.controller';

const moduleName = 'ovhManagerHostingMultisite';

angular
  .module(moduleName, [
    cdnFlush,
    hostingMultisiteGitAssociation,
    hostingMultisiteGitDeployment,
    hostingMultisiteGitRemoval,
    hostingMultisiteGitViewLastDeployment,
  ])
  .config(routing)
  .controller('MultisiteDiagnosticCtrl', multisiteDiagnosticCtrl)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
