import angular from 'angular';

import directive from './directive';

import './index.less';

const moduleName = 'cucHighlightedElement';

angular.module(moduleName, []).directive('cucHighlightedElement', directive);

export default moduleName;
