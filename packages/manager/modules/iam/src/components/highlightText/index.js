import angular from 'angular';

import directive from './highlightText.directive';

const moduleName = 'ovhManagerIAMComponentsHighlightText';

angular.module(moduleName, []).directive('iamHighlightText', directive);

export default moduleName;
