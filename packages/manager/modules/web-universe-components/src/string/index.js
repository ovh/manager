import angular from 'angular';

import wucSliceContentFilter from './SliceContent';
import wucSliceEmailFilter from './SliceEmail';

const moduleName = 'wucString';

angular
  .module(moduleName, [])
  .filter('wucSliceContent', wucSliceContentFilter)
  .filter('wucSliceEmail', wucSliceEmailFilter);

export default moduleName;
