export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.hosting.cdn.order', {
    url: '/order',
    translations: { value: ['.'], format: 'json' },
    component: 'hostingCdnOrder',
    resolve: {
      goBack: /* @ngInject */ goToHosting => goToHosting,

      availableOffers: /* @ngInject */ (
        isOptionFree,
        $translate,
        HostingOptionOrder,
      ) => HostingOptionOrder
        .getOrderEnums('hosting.web.CdnOfferEnum')
        .then((models) => {
          const getOfferName = (offer) => {
            const offerKey = `hosting_dashboard_cdn_order_${offer}`;
            const offerName = $translate.instant(offerKey);

            return (offerName === offerKey) ? offer : offerName;
          };

          const availableOffers = !isOptionFree
            ? models.filter(offer => offer !== 'CDN_BUSINESS_FREE')
            : ['CDN_BUSINESS_FREE'];

          return availableOffers.map(offer => ({
            label: getOfferName(offer),
            value: offer,
          }));
        }),
      hosting: /* @ngInject */ (productId, Hosting) => Hosting.getSelected(productId),
      hostingProxy: /* @ngInject */ (productId, Hosting) => Hosting.getHosting(productId),
      productId: /* @ngInject */ $transition$ => $transition$.params().productId,

      isOptionFree: /* @ngInject */ (hosting, isPerfOffer) => isPerfOffer() || hosting.isCloudWeb,
      isOrderable: /* @ngInject */ (productId, HostingOptionOrder) => HostingOptionOrder
        .isOptionOrderable('cdn', productId),
      isPerfOffer: /* @ngInject */ (hostingProxy, Hosting) => () => Hosting
        .constructor
        .isPerfOffer(hostingProxy.offer),
    },
  });
};
