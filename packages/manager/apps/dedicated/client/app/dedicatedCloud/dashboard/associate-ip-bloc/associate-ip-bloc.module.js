import angular from 'angular';

import moveIpComponent from '../../../components/move-ip';
import routing from './associate-ip-bloc.routing';

const moduleName = 'ovhManagerPccDashboardAssociateIpBloc';

angular
  .module(moduleName, [moveIpComponent])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
