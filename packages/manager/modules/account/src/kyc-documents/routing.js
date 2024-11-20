import { FRAUD_STATUS } from './constants';

export default /* @ngInject */ ($stateProvider) => {
  const kycFraudFeatureFlippingKey = 'procedures:fraud';

  $stateProvider.state('account.kyc-documents', {
    url: '/documents',
    template: '<div data-ui-view></div>',
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
      isKycFraudAvailable: /* @ngInject */ ($http) => {
        return $http
          .get(`/feature/${kycFraudFeatureFlippingKey}/availability`, {
            serviceType: 'aapi',
          })
          .then(
            ({ data: featureAvailability }) =>
              featureAvailability[kycFraudFeatureFlippingKey],
          );
      },
      apiPath: () => '/me/procedure/fraud',
      resource: /* @ngInject */ ($http, apiPath, isKycFraudAvailable) =>
        isKycFraudAvailable
          ? $http.get(apiPath).then(({ data }) => data)
          : null,
      isDisabled: /* @ngInject */ (resource) =>
        resource.status !== FRAUD_STATUS.REQUIRED,
      user: /* @ngInject */ (coreConfig) => coreConfig.getUser(),
      hubLink: /* @ngInject */ (coreURLBuilder) =>
        coreURLBuilder.buildURL('hub', '/#'),
    },
    redirectTo: (transition) =>
      Promise.all([
        transition.injector().getAsync('isKycFraudAvailable'),
        transition.injector().getAsync('resource'),
      ]).then(([isKycFraudAvailable, resource]) => {
        return isKycFraudAvailable &&
          [FRAUD_STATUS.REQUIRED, FRAUD_STATUS.OPEN].includes(resource?.status)
          ? { state: 'account.kyc-documents.documents' }
          : { state: 'account.user.dashboard' };
      }),
  });
};
