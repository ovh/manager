import atInternet from '@ovh-ux/ng-at-internet';

import acceptAll from './popup-agreement/popup-agreement.module';
import details from './details/details.module';
import routing from './user-agreements.routes';

const moduleName = 'ovhManagerBillingAgreements';

angular
  .module(moduleName, ['ui.router', acceptAll, atInternet, details])
  .config(routing);

export default moduleName;
