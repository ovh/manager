import managerErrorPage from '@ovh-ux/manager-error-page';

import routing from './error.routing';

const moduleName = 'ovhManagerCloudError';

angular.module(moduleName, ['ui.router', managerErrorPage]).config(routing);

export default moduleName;
