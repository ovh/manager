import JSURL from 'jsurl';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.hosting.dashboard.website-coach', {
    url: '/website-coach',
    component: 'hostingWebsiteCoach',
    resolve: {
      activateWebsiteCoach: /* @ngInject */ ($window, WucUser) => (
        attachedDomain,
      ) => {
        WucUser.getUrlOfEndsWithSubsidiary('express_order').then(
          (expressOrderUrl) => {
            const orderParams = [
              {
                configuration: [
                  {
                    label: 'domain',
                    values: [attachedDomain],
                  },
                ],
                option: [],
                planCode: 'labs-webcoach',
                productId: 'webCoach',
                quantity: 1,
              },
            ];

            $window.open(
              `${expressOrderUrl}#/express/review?products=${JSURL.stringify(
                orderParams,
              )}`,
              '_blank',
            );
          },
        );
      },
      attachedDomains: /* @ngInject */ (productId, HostingModule) =>
        HostingModule.getAttachedDomains(productId),
      productId: /* @ngInject */ (serviceName) => serviceName,
      screenshot: /* @ngInject */ (productId, OvhApiScreenshot) =>
        OvhApiScreenshot.Aapi()
          .get({ url: productId })
          .$promise.then((screenshot) => screenshot),
      user: /* @ngInject */ (WucUser) => WucUser.getUser(),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('hosting_website_coach_title'),
    },
  });
};
