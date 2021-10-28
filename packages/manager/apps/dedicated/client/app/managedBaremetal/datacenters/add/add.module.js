import angular from 'angular';

import datacenterAddComponent from '../../../components/dedicated-cloud/datacenter/add';
import routing from './add.routes';
import upgradeRange from './upgrade-range';

const moduleName = 'managedBaremetalDatacentersAdd';

angular
  .module(moduleName, [datacenterAddComponent, upgradeRange])
  .config(routing);

export default moduleName;
