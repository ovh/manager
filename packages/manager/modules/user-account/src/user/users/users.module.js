import angular from 'angular';
import routing from './users.routing';

const moduleName = 'ovhManagerDedicatedAccountUserUsers';

angular.module(moduleName, []).config(routing);

export default moduleName;
