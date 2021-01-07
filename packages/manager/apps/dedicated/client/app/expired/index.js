import '@uirouter/angularjs';
import managerErrorPage from '@ovh-ux/manager-error-page';

import routing from './expired.routing';

const moduleName = 'ovhManagerDedicatedExpired';

angular.module(moduleName, ['ui.router', managerErrorPage]).config(routing);

export default moduleName;
