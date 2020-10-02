import dashboard from './ip/ip.module';
import routing from './routing';

angular
  .module('Module.ip', [
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
