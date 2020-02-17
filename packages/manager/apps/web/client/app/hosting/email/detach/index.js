import angular from 'angular';
import '@uirouter/angularjs';

import component from './detach.component';
import routing from './detach.routing';

const moduleName = 'webHostingEmailDetach';

angular
  .module(moduleName, ['ui.router'])
  .component(component.name, component)
  .config(routing);

export default moduleName;
