import angular from 'angular';

import component from './vrack-move-dialog.component';
import routing from './vrack-move-dialog.routing';

const moduleName = 'ovhManagerVrackMoveDialogModule';

angular
  .module(moduleName, [])
  .config(routing)
  .component('ovhManagerVrackMoveDialogComponent', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
