<% const pascalcasedName = this.camelcase(name, { pascalCase: false }) -%>
export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.onboarding', {
    url: '/onboarding',
    component: '<%= pascalcasedName %>Onboarding',
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('resources')
        .then((services) =>
          services.length !== 0
            ? {
                state: 'app.index',
              }
            : false,
        ),
    resolve: {
      breadcrumb: () => null,
    },
  });
};
