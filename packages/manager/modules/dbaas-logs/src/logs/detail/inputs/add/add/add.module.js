import angular from 'angular';

import '@uirouter/angularjs';

import edit from '../edit/edit.module';
import routing from './add.routing';

const moduleName = 'ovhManagerDbaasLogsDetailInputsAddAdd';

angular.module(moduleName, ['ui.router', edit]).config(routing);

export default moduleName;
