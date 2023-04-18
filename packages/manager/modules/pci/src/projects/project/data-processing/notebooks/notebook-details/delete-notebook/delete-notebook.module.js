import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from '../../../components/delete-notebook';
import routing from './delete-notebook.routing';

const moduleName =
  'ovhManagerPciProjectDataProcessingNotebookDetailsQuickDeleteModal';

angular.module(moduleName, ['ui.router', component]).config(routing);

export default moduleName;
