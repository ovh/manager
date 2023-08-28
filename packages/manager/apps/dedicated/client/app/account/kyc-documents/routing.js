import { FRAUD_STATUS } from './constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.account.kyc-documents', {
    url: '/documents',
    template: '<div data-ui-view></div>',
    redirectTo: 'app.account.kyc-documents.documents',
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
      isDisabled: /* @ngInject */ (resource) =>
        resource.status !== FRAUD_STATUS.REQUIRED,
      user: /* @ngInject */ (coreConfig) => coreConfig.getUser(),
      hubLink: /* @ngInject */ (coreURLBuilder) =>
        coreURLBuilder.buildURL('hub', '/#'),
    },
  });
};
