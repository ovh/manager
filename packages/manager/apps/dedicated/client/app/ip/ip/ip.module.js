import ngOvhFeatureFlipping from '@ovh-ux/ng-ovh-feature-flipping';
import 'ovh-api-services';

import routing from './ip-dashboard.routing';

import ipAlerts from '../components/alerts';
import ipList from '../components/list';

import ipService from './ip-ip.service';
import ipExpandService from './ip-ip-expand-ipv6.service';

import vrackService from './vrack.service';

const moduleName = 'ovhManagerIpDashboard';

angular
  .module(moduleName, [
    ngOvhFeatureFlipping,
    ipAlerts,
    ipList,
    'ovh-api-services',
  ])
  .config(routing)
  .service('Ip', ipService)
  .service('Vrack', vrackService)
  .service('IpExpandIpv6', ipExpandService);

export default moduleName;
