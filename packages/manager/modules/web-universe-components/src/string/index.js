import angular from 'angular';

import wucSliceContentFilter from './SliceContent';

const moduleName = 'wucString';

angular.module(moduleName, []).filter('wucSliceContent', wucSliceContentFilter);

export default moduleName;
