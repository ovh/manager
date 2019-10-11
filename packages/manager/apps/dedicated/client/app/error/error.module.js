import component from './error.component';
import routing from './error.routing';

import './error.scss';

const moduleName = 'ovhManagerDedicatedError';

angular.module(moduleName, [
  'ui.router',
])
  .config(routing)
  .component('managerDedicatedError', component);

export default moduleName;
