import ngOvhFeatureFlipping from '@ovh-ux/ng-ovh-feature-flipping';

import routing from './ip-dashboard.routing';

import ipAlerts from '../components/alerts';
import ipList from '../components/list';

import ipService from './ip-ip.service';
import ipExpandService from './ip-ip-expand-ipv6.service';

const moduleName = 'ovhManagerIpDashboard';

angular
  .module(moduleName, [ngOvhFeatureFlipping, ipAlerts, ipList])
  .config(routing)
  .service('Ip', ipService)
  .service('IpExpandIpv6', ipExpandService);

export default moduleName;
