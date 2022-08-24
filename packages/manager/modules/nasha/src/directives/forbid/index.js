import angular from 'angular';
import directive from './forbid.directive';

const moduleName = 'ovhManagerNashaDirectivesForbid';

angular.module(moduleName, []).directive('forbid', directive);

export default moduleName;
