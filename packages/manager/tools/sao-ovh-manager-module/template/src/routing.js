<% const pascalcasedName = this.camelcase(name, { pascalCase: true }) -%>export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('app', {
      url: '/<%= name %>',
      component: 'ovhManager<%= pascalcasedName %>Component',
    });
};
