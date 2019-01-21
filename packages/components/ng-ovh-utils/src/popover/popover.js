import angular from 'angular';

import linkedpopover from './linkedpopover/linkedpopover';
import simplepopover from './simplepopover/simplepopover';
import simpletooltip from './simpletooltip/simpletooltip';

import popoverService from './popover-service';

const moduleName = 'ua.popover';

angular
  .module(moduleName, [linkedpopover, simplepopover, simpletooltip])
  .provider('popoverFactory', popoverService);

export default moduleName;
