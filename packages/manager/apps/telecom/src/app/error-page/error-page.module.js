import managerErrorPage from '@ovh-ux/manager-error-page';

import routing from './error-page.routing';

const moduleName = 'ovhManagerTelecomError';

angular.module(moduleName, [
  managerErrorPage,
])
  .config(routing);

export default moduleName;
