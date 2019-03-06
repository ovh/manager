import angular from 'angular';

import directive from './directive';
import './region.less';

const moduleName = 'ovhManagerPciComponentsWriteRightRequired';

angular
  .module(moduleName, [])
  .directive('writeRightRequired', directive);

export default moduleName;
