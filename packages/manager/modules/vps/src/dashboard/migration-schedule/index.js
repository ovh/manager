import angular from 'angular';
import '@uirouter/angularjs';

import routing from './vps-dashboard-migration-schedule.routing';
import migrationSchedule from '../../migration/components/plan';

const moduleName = 'ovhManagerVpsDashboardSchedule';

angular.module(moduleName, ['ui.router', migrationSchedule]).config(routing);

export default moduleName;
