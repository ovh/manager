import angular from 'angular';

import add from './add';
import datacentersComponent from '../../components/dedicated-cloud/datacenters';
import datacenter from '../datacenter';
import routing from './datacenters.routes';

const moduleName = 'managedBaremetalDatacenters';

angular
  .module(moduleName, [add, datacentersComponent, datacenter])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
