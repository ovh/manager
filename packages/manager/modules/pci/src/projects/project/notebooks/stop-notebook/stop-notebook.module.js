import angular from 'angular';
import '@uirouter/angularjs';

import stopNotebook from '../components/stop-notebook';
import routing from './stop-notebook.routing';

const moduleName = 'ovhManagerPciNotebooksNotebookStop';

angular.module(moduleName, ['ui.router', stopNotebook]).config(routing);

export default moduleName;
