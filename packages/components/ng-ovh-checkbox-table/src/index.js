import angular from 'angular';

import directive from './directive';

const moduleName = 'ngOvhCheckboxTable';

angular
  .module(moduleName, [])
  .directive('ovhCheckboxTable', directive);

export default moduleName;
