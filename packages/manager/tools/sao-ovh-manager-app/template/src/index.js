<% const pascalcasedName = this.camelcase(name, { pascalCase: true }) -%>import 'script-loader!jquery'; // eslint-disable-line
import '@ovh-ux/manager-<%= name %>';
import { Environment } from '@ovh-ux/manager-config';
import angular from 'angular';

Environment.setRegion(__WEBPACK_REGION__);

angular
  .module('<%= this.camelcase(name) %>App', [
    'ovhManager<%= pascalcasedName %>',
  ]);
