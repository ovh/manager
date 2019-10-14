import routing from './dns-zone-dynhost.routing';

const moduleName = 'ovhManagerWebDomainZoneDynHost';

angular
  .module(moduleName, [])
  .config(routing);

export default moduleName;
