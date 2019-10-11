import controller from './hosting-cdn-terminate.controller';

const moduleName = 'ovhManagerHostingCdnTerminate';

angular
  .module(moduleName, [])
  .controller('HostingTerminateCdnCtrl', controller);

export default moduleName;
