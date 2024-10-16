import angular from 'angular';

import moveIpComponent from '../../../components/move-ip';
import routing from './associate-ip-bloc.routing';

const moduleName = 'ovhManagerPccDashboardLightAssociateIpBloc';

angular.module(moduleName, [moveIpComponent]).config(routing);

export default moduleName;
