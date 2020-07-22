import acceptAll from './accept-all/accept-all.module';
import details from './details/details.module';
import routing from './user-agreements.routes';

const moduleName = 'ovhManagerBillingAgreements';

angular.module(moduleName, ['ui.router', acceptAll, details]).config(routing);

export default moduleName;
