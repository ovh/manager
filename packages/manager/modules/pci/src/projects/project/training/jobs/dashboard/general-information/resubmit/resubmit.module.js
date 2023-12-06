import angular from 'angular';
import '@uirouter/angularjs';

import resubmitComponent from '../../../components/resubmit';
import routing from './resubmit.routing';

const moduleName = 'ovhManagerPciTrainingJobsDashboardResubmit';

angular.module(moduleName, ['ui.router', resubmitComponent]).config(routing);

export default moduleName;
