import details from './details/details.module';

import routing from './user-agreements.routes';

const moduleName = 'ovhManagerBillingAgreements';

angular.module(moduleName, ['ui.router', details]).config(routing);

export default moduleName;
