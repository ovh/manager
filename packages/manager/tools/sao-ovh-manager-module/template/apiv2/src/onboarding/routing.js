<% const pascalcasedName = this.camelcase(name, { pascalCase: false }) -%>
export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.onboarding', {
    url: '/onboarding',
    component: '<%= pascalcasedName %>Onboarding',
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('createItemsPromise')
        .then((getResources) => {
          return getResources({}).then(({ data }) => {
            return Array.isArray(data) && data.length > 0
              ? {
                  state: 'app.index',
                }
              : false;
          });
        }),
    resolve: {
      breadcrumb: () => null,
    },
  });
};
