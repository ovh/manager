import angular from 'angular';

import directive from './directive';

const moduleName = 'ngOvhJqueryUiDroppable';

angular.module(moduleName, []).directive('droppable', directive);

export default moduleName;
