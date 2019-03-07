import angular from 'angular';

import directive from './directive';

const moduleName = 'ngOvhJqueryUiDraggable';

angular
  .module(moduleName, [])
  .directive('draggable', directive);

export default moduleName;
