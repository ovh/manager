angular
  .module('managerApp')
  .controller('XdslModemRouterCtrl', function XdslModemRouterCtrl(
    TucPackXdslModemMediator,
  ) {
    this.mediator = TucPackXdslModemMediator;
  });
