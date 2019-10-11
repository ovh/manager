import JSURL from 'jsurl';

export default /* @ngInject */($stateProvider) => {
  $stateProvider.state('app.hosting.website-coach', {
    url: '/website-coach',
    translations: { value: ['.'], format: 'json' },
    component: 'hostingWebsiteCoach',
    resolve: {
      activateWebsiteCoach: /* @ngInject */ ($window, User) => (attachedDomain) => {
        User
          .getUrlOfEndsWithSubsidiary('express_order')
          .then((expressOrderUrl) => {
            const orderParams = [{
              configuration: [{
                label: 'domain',
                values: [attachedDomain],
              }],
              option: [],
              planCode: 'labs-webcoach',
              productId: 'webCoach',
              quantity: 1,
            }];

            $window.open(
              `${expressOrderUrl}#/express/review?products=${JSURL.stringify(orderParams)}`,
              '_blank',
            );
          });
      },
      attachedDomains: /* @ngInject */ (productId, HostingModule) => HostingModule
        .getAttachedDomains(productId),
      productId: /* @ngInject */ $transition$ => $transition$.params().productId,
      screenshot: /* @ngInject */ (productId, OvhApiScreenshot) => OvhApiScreenshot
        .Aapi()
        .get({ url: productId })
        .$promise
        .then(screenshot => screenshot),
      user: /* @ngInject */ User => User.getUser(),
    },
  });
};
