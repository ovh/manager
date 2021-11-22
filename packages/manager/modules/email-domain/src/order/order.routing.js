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
    onExit: /* @ngInject */ ($q, cart, WucOrderCartService) =>
      WucOrderCartService.deleteCart(cart).catch((error) =>
        error.status === 404 ? $q.resolve() : $q.reject(error),
      ),
    resolve: {
      addConfiguration: /* @ngInject */ (cart, MXPlanService) => (
        item,
        product,
        domain,
      ) => MXPlanService.addDomainConfiguration(cart, item, product, domain),
      cart: /* @ngInject */ (WucOrderCartService, user) =>
        WucOrderCartService.createNewCart(
          user.ovhSubsidiary,
        ).then(({ cartId }) =>
          WucOrderCartService.assignCart(cartId).then(() => cartId),
        ),
      catalog: /* @ngInject */ (OvhApiOrderCatalogPublicV6, user) =>
        OvhApiOrderCatalogPublicV6.get({
          productName: PRODUCT_NAME,
          ovhSubsidiary: user.ovhSubsidiary,
        }).$promise,
      deleteItem: /* @ngInject */ ($q, cart, WucOrderCartService) => (item) =>
        item ? WucOrderCartService.deleteItem(cart, item.itemId) : $q.resolve(),
      domain: /* @ngInject */ ($transition$) => $transition$.params().domain,
      domains: /* @ngInject */ ($q, iceberg, OvhApiDomain) =>
        $q
          .all({
            domains: OvhApiDomain.v6().query().$promise,
            zones: OvhApiDomain.Zone()
              .v6()
              .query().$promise,
            emailDomains: iceberg('/email/domain')
              .query()
              .expand('CachedObjectList-Pages')
              .addFilter('offer', 'ne', 'redirect')
              .execute().$promise,
          })
          .then(({ domains, zones, emailDomains }) => {
            const domainNames = map(emailDomains.data, 'domain');
            return filter(
              union(domains, zones),
              (domain) => !includes(domainNames, domain),
            ).sort();
          }),
      getCheckout: /* @ngInject */ (cart, WucOrderCartService) => () =>
        WucOrderCartService.getCheckoutInformations(cart),
      order: /* @ngInject */ (cart, WucOrderCartService) => (
        autoPayWithPreferredPaymentMethod,
      ) =>
        WucOrderCartService.checkoutCart(cart, {
          autoPayWithPreferredPaymentMethod,
        }),
      products: /* @ngInject */ (cart, WucOrderCartService) =>
        WucOrderCartService.getProductOffers(
          cart,
          PRODUCT_NAME,
        ).then((offers) => map(offers, (offer) => new EmailDomainOffer(offer))),
      hideBreadcrumb: () => true,
    },
    translations: { value: ['.'], format: 'json' },
  });
};
