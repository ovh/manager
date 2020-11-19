import routing from './pack-xdsl-access-comfort-exchange.routing';
import xdslAccessComfortExchange from './pack-xdsl-access-comfort-exchange.component';
import service from './pack-xdsl-access-comfort-exchange.service';

angular
  .module('managerApp')
  .component('xdslAccessComfortExchange', xdslAccessComfortExchange)
  .config(routing)
  .service('XdslAccessComfortExchangeService', service)
  .run(/* @ngTranslationsInject:json ./translations */);
