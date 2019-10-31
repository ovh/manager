<% const pascalcasedName = this.camelcase(name, { pascalCase: true }) -%>import 'script-loader!jquery'; // eslint-disable-line
import '@ovh-ux/manager-<%= name %>';

import angular from 'angular';

angular
  .module('<%= pascalcasedName %>App', [
    'ovhManager<%= pascalcasedName %>',
  ]);
