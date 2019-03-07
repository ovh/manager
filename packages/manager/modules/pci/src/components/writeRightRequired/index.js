import angular from 'angular';

import componentsProjectRights from '../project/rights';

import directive from './directive';

const moduleName = 'ovhManagerPciComponentsWriteRightRequired';

angular
  .module(moduleName, [
    componentsProjectRights,
  ])
  .directive('writeRightRequired', directive);

export default moduleName;
