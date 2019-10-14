import routing from './dns-zone-new.routing';
import service from './dns-zone-new.service';

const moduleName = 'ovhManagerWebDomainDnsZoneNew';

angular
  .module(moduleName, [])
  .config(routing)
  .service('newDnsZone', service);

export default moduleName;
