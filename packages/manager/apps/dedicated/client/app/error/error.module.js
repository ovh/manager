import managerErrorPage from '@ovh-ux/manager-error-page';

import routing from './error.routing';

import './error.scss';

const moduleName = 'ovhManagerDedicatedError';

angular.module(moduleName, [
  'ui.router',
  managerErrorPage,
])
  .config(routing);

export default moduleName;
