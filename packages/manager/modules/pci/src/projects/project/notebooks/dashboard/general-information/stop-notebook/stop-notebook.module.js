import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import stopNotebook from '../../../components/stop-notebook';
import routing from './stop-notebook.routing';

const moduleName = 'ovhManagerPciNotebooksNotebookDashboardNotebookStop';

angular.module(moduleName, ['ui.router', stopNotebook]).config(routing);

export default moduleName;
