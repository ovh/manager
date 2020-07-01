import angular from 'angular';

import component from './overTheBox-tasks.component';
import routing from './overTheBox-tasks.routing';

const moduleName = 'ovhManagerOtbTasks';

angular
  .module(moduleName, [])
  .component('overTheBoxTasks', component)
  .config(routing);

export default moduleName;
