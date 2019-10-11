import controller from './hosting-cdn-flush.controller';

const moduleName = 'ovhManagerHostingCdnFlush';

angular
  .module(moduleName, [])
  .controller('HostingFlushCdnCtrl', controller);

export default moduleName;
