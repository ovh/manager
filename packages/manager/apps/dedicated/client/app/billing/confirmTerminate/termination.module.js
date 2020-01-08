import routing from './termination.routing';

const moduleName = 'ovhManagerBillingTermination';

angular.module(moduleName, ['ui.router']).config(routing);

export default moduleName;
