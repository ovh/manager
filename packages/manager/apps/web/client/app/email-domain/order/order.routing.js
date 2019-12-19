import filter from 'lodash/filter';
import includes from 'lodash/includes';
import map from 'lodash/map';
import union from 'lodash/union';
import { PRODUCT_NAME } from './order.constants';
import EmailDomainOffer from './EmailDomainOffer.class';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.mx-plan', {
    url: '/configuration/mx_plan?domain',
    component: 'emailDomainOrder',
    params: {
      domain: null,
    },
    onExit: /* @ngInject */(cart, OrderService) => OrderService.deleteCart(cart),
    resolve: {
      addConfiguration: /* @ngInject */ (
        cart,
        MXPlanService,
      ) => (
        item,
        product,
        domain,
      ) => MXPlanService.addDomainConfiguration(cart, item, product, domain),
      cart: /* @ngInject */ (
        OrderService,
        user,
      ) => OrderService.createNewCart(user.ovhSubsidiary)
        .then(({ cartId }) => OrderService.assignCart(cartId)
          .then(() => cartId)),
      catalog: /* @ngInject */
        (OvhApiOrderCatalogPublicV6, user) => OvhApiOrderCatalogPublicV6.get({
          productName: PRODUCT_NAME,
          ovhSubsidiary: user.ovhSubsidiary,
        }).$promise,
      deleteItem: /* @ngInject */ (
        $q,
        cart,
        OrderService,
      ) => (item) => (item ? OrderService.deleteItem(cart, item.itemId) : $q.resolve()),
      domain: /* @ngInject */ ($transition$) => $transition$.params().domain,
      domains: /* @ngInject */ (
        $q,
        iceberg,
        OvhApiDomain,
      ) => $q.all({
        domains: OvhApiDomain.v6().query().$promise,
        zones: OvhApiDomain.Zone().v6().query().$promise,
        emailDomains: iceberg('/email/domain')
          .query()
          .expand('CachedObjectList-Pages')
          .addFilter('offer', 'ne', 'redirect')
          .execute().$promise,
      })
        .then(({ domains, zones, emailDomains }) => {
          const domainNames = map(emailDomains.data, 'domain');
          return filter(
            union(domains, zones), (domain) => !includes(domainNames, domain),
          ).sort();
        }),
      getCheckout: /* @ngInject */ (
        cart,
        OrderService,
      ) => () => OrderService.getCheckoutInformations(cart),
      order: /* @ngInject */ (
        cart,
        OrderService,
      ) => (autoPayWithPreferredPaymentMethod) => OrderService
        .checkoutCart(cart, { autoPayWithPreferredPaymentMethod }),
      products: /* @ngInject */ (
        cart,
        OrderService,
      ) => OrderService.getProductOffers(cart, PRODUCT_NAME)
        .then((offers) => map(offers, (offer) => new EmailDomainOffer(offer))),
    },
    translations: { value: ['.'], format: 'json' },
  });
};
