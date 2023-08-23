export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('kyc-documents', {
    url: '/documents',
    template: '<div data-ui-view></div>',
    redirectTo: 'kyc-documents.documents',
    resolve: {
      breadcrumb: () => null,
      breadcrumbPrefix: /* @ngInject */ (
        $injector,
        $q,
        coreURLBuilder,
        $translate,
      ) => {
        const name = $translate.instant('kyc_documents_breadcrumb_prefix');
        if ($injector.has('shellClient')) {
          return $injector
            .get('shellClient')
            .navigation.getURL('dedicated', `#/useraccount/dashboard`)
            .then((url) => [{ name, url }]);
        }
        return $q.when([
          {
            name,
            url: coreURLBuilder.buildURL(
              'dedicated',
              `#/useraccount/dashboard`,
            ),
          },
        ]);
      },
      apiPath: () => '/me/procedure/fraud',
      resource: /* @ngInject */ ($http, apiPath) =>
        $http.get(apiPath).then(({ data }) => data),
      user: /* @ngInject */ (coreConfig) => coreConfig.getUser(),
    },
  });
};
