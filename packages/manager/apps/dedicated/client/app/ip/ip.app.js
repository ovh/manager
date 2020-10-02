import associateIpBloc from './ip/associate-ip-bloc';
import dashboard from './ip/ip.module';
import routing from './routing';

angular
  .module('Module.ip', [
    associateIpBloc,
    'Module.ip.controllers',
    'Module.ip.filters',
    'Module.ip.services',
    'ngOvhUtils',
    'ngRoute',
    'ngSanitize',
    'ui.bootstrap',
    dashboard,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);
