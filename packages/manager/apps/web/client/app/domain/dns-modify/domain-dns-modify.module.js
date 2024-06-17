import 'angular-translate';
import controller from './domain-dns-modify.controller';
import template from './domain-dns-modify.html';
import routing, { componentName } from './domain-dns-modify.state';

angular
  .module(componentName, [])
  .component(componentName, { controller, template })
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default componentName;
