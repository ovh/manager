import managerErrorPage from '@ovh-ux/manager-error-page';

import routing from './error.routing';

const moduleName = 'ovhManagerCarbonCalculatorError';

angular.module(moduleName, [managerErrorPage]).config(routing);

export default moduleName;
