import angular from 'angular';

import tucFileReaderDirective from './file-reader.directive';
import './file-reader.less';

const moduleName = 'tucFileReader';

angular
  .module(moduleName, [])
  .directive('tucFileReader', tucFileReaderDirective);

export default moduleName;
