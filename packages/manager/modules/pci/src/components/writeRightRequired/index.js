import angular from 'angular';
import '@uirouter/angularjs';

import projectRights from '../project/rights';

import directive from './directive';

const moduleName = 'ovhManagerPciComponentsWriteRightRequired';

angular
  .module(moduleName, [projectRights, 'ui.router'])
  .directive('writeRightRequired', directive);

export default moduleName;
