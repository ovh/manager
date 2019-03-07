import angular from 'angular';

import filelistener from './filelistener';
import modal from './modal';
import promiseTaskState from './promise-task-state';
import scrollHere from './scrollHere';
import showByte from './show-byte';
import units from './units';

// TODO : import './index.less';

const moduleName = 'ovhManagerPciComponentsRunabove';

angular
  .module(moduleName, [
    filelistener,
    modal,
    promiseTaskState,
    scrollHere,
    showByte,
    units,
  ]);

export default moduleName;
