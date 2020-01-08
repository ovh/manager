import angular from 'angular';
import '@uirouter/angularjs';

import moveDialogModule from './vrack-move-dialog.module';

const moduleName = 'ovhManagerVrackMoveDialog';

angular.module(moduleName, ['ui.router', moveDialogModule]);

export default moduleName;
