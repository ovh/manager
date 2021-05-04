import map from 'lodash/map';
import set from 'lodash/set';
import get from 'lodash/get';
import groupBy from 'lodash/groupBy';
import sortBy from 'lodash/sortBy';
import { find, compact } from 'lodash';

import Addon from './addon.class';
import Project from './project.class';
import Plan from './plan.class';
import PlanFamily from './family.class';
import UserLicence from './user-licence.class';
import {
  ADDON_FAMILY,
  DEFAULT_ENVIRONMENT,
  PLAN_CODE,
  SORT_ORDER_PLANS,
  STORAGE_MULTIPLE,
} from './web-paas.constants';
import { ADDON_FAMILY_STAGING_ENVIRONMENT } from './components/additional-option/constants';

export default class WebPaasService {
  /* @ngInject */
  constructor(
    $http,
    $q,
    $translate,
    $window,
    atInternet,
    coreConfig,
    WucOrderCartService,
    iceberg,
    OvhApiOrder,
    OvhApiMe,
    WucUser,
  ) {
    this.$http = $http;
    this.$q = $q;
    this.$window = $window;
    this.atInternet = atInternet;
    this.coreConfig = coreConfig;
    this.iceberg = iceberg;
    this.$translate = $translate;
    this.WucOrderCartService = WucOrderCartService;
    this.OvhApiOrderCart = OvhApiOrder.Cart().v6();
    this.OvhApiOrderCartProduct = OvhApiOrder.Cart()
      .Product()
      .v6();
    this.OvhApiOrderCartConfig = OvhApiOrder.Cart()
      .Item()
      .Configuration()
      .v6();
    this.OvhApiMeOrder = OvhApiMe.Order().v6();
    this.OvhApiMe = OvhApiMe;
    this.WucUser = WucUser;
  }

  getProjects() {
    return this.iceberg('/webPaaS/subscription')
      .query()
      .expand('CachedObjectList-Pages')
      .execute({}, true)
      .$promise.then(({ data }) => {
        return this.getMe().then((me) =>
          map(
            data,
            (project) =>
              new Project({
                ...project,
                isAdmin:
                  get(project, 'metadata.customer.accountName') ===
                  me.nichandle,
              }),
          ),
        );
      });
  }

  getProjectDetails(projectId) {
    return this.$http
      .get(`/webPaaS/subscription/${projectId}`)
      .then(({ data }) => new Project(data));
  }

  getCapabilities(planCode) {
    return this.$http
      .get('/webPaaS/capabilities', {
        params: {
          planCode,
        },
      })
      .then((res) => res.data);
  }

  terminateProject(projectId) {
    return this.$http
      .post(`/webPaaS/subscription/${projectId}/terminate`, {
        params: {
          serviceName: projectId,
        },
      })
      .then(({ data }) => data);
  }

  getCatalog(ovhSubsidiary, availablePlans) {
    return this.WucOrderCartService.getProductPublicCatalog(
      ovhSubsidiary,
      'webPaaS',
    ).then((catalog) => {
      const sortedConfig = this.sortSetVcpuConfig(catalog.plans);
      if (availablePlans) {
        sortedConfig.forEach((plan) =>
          find(availablePlans, { planCode: plan.planCode })
            ? set(plan, 'available', true)
            : set(plan, 'available', false),
        );
      }
      const groupedPlans = this.groupPlans(sortedConfig);
      set(catalog, 'plans', sortedConfig);
      set(catalog, 'productList', groupedPlans);
      return catalog;
    });
  }

  getServiceInfos(projectId) {
    return this.$http
      .get(`/webPaaS/subscription/${projectId}/serviceInfos`)
      .then(({ data }) => data);
  }

  /**
   * @param {*} plans
   * @returns Grouped plans according to the products i.e., 'expand', 'develop', 'start'
   */
  groupPlans(plans) {
    this.groupedPlans = map(
      groupBy(
        map(plans, (plan) => new Plan(plan)),
        'blobs.commercial.range',
      ),
      (value, key) => ({
        name: key.toLowerCase(),
        plans: value,
        selectedPlan:
          key.toLowerCase() === PLAN_CODE.START ? value[1] : value[0],
      }),
    );
    this.groupedPlans = map(
      this.groupedPlans,
      (family) => new PlanFamily(family),
    );
    this.groupedPlans = sortBy(this.groupedPlans, (family) =>
      SORT_ORDER_PLANS.indexOf(family.name),
    );
    return this.groupedPlans;
  }

  /**
   *
   * @param {*} catalog
   * @returns plans which have vcpuConfig text and sorted by number of cores in a plan
   */
  /* eslint-disable-next-line class-methods-use-this */
  sortSetVcpuConfig(plans) {
    const data = map(plans, (plan) => ({
      ...plan,
      available: true,
      vcpuConfig: `${get(plan, 'blobs.technical.cpu.cores')} vCPU prod(${get(
        plan,
        'blobs.technical.cpu.cores',
      ) / 2} vCPU Staging)`,
    }));
    return sortBy(data, ['blobs.technical.cpu.cores']);
  }

  getUsers(projectId) {
    return this.$http
      .get(`/webPaaS/subscription/${projectId}/customer`)
      .then(({ data }) => map(data, (user) => new UserLicence(user)));
  }

  inviteUser(projectId, accountName) {
    return this.$http.post(`/webPaaS/subscription/${projectId}/customer`, {
      accountName,
    });
  }

  deleteUser(projectId, customerId) {
    return this.$http.delete(
      `/webPaaS/subscription/${projectId}/customer/${customerId}`,
    );
  }

  getMe() {
    return this.OvhApiMe.v6().get().$promise;
  }

  createCart() {
    return this.getMe().then(
      (me) =>
        this.OvhApiOrderCart.post({ ovhSubsidiary: me.ovhSubsidiary }).$promise,
    );
  }

  assignCart(cart) {
    return this.OvhApiOrderCart.assign({
      cartId: cart.cartId,
      autoPayWithPreferredPaymentMethod: true,
    }).$promise.then(() => cart);
  }

  getAddonOptions(cart, plan) {
    return this.$http
      .get(`/order/cart/${cart.cartId}/webPaaS/options`, {
        params: {
          cart: cart.cartId,
          planCode: plan.planCode,
        },
      })
      .then(({ data }) => map(data, (option) => new Addon(option)));
  }

  addToCart(cartId, plan) {
    return this.OvhApiOrderCartProduct.post({
      cartId,
      productName: 'webPaaS',
      duration: 'P1M',
      planCode: plan.planCode,
      pricingMode: 'default',
      quantity: 1,
    }).$promise;
  }

  getAddons(plan) {
    return this.createCart()
      .then((cart) => this.assignCart(cart))
      .then((cart) => this.addToCart(cart.cartId, plan))
      .then((cart) => {
        this.cart = cart;
        return this.getAddonOptions(cart, plan).then((res) => res);
      })
      .finally(() => this.deleteCart());
  }

  addAddons(cart, addons) {
    return this.$q
      .all(
        map(addons, (addon) => {
          const capacity = get(addon, 'prices').find(({ capacities }) =>
            capacities.includes('renew'),
          );
          if (
            (addon.family !== ADDON_FAMILY.STORAGE && addon.quantity > 0) ||
            addon.family === ADDON_FAMILY.ENVIRONMENT
          ) {
            return this.OvhApiOrderCartProduct.postOptions({
              cartId: cart.cartId,
              productName: 'webPaaS',
              duration: capacity.duration,
              planCode: addon.planCode,
              pricingMode: 'default',
              quantity:
                addon.family === ADDON_FAMILY.ENVIRONMENT
                  ? addon.quantity + DEFAULT_ENVIRONMENT
                  : addon.quantity,
              itemId: cart.itemId,
            }).$promise.then((cartResult) => {
              if (cartResult.settings.planCode.indexOf('environment') > 0) {
                this.environmentItemId = cartResult.itemId;
              }
            });
          }
          return this.$q.resolve(cart);
        }),
      )
      .then(() => cart);
  }

  addConfig(cart, config) {
    return this.$q
      .all(
        config.map(
          ({ label, value }) =>
            this.OvhApiOrderCartConfig.post({
              cartId: cart.cartId,
              itemId: cart.itemId,
              label,
              value,
            }).$promise,
        ),
      )
      .then(() => cart);
  }

  addAddonOptions(cart, addons) {
    const storageAddon = find(addons, { family: ADDON_FAMILY.STORAGE });
    const capacity = get(storageAddon, 'prices').find(({ capacities }) =>
      capacities.includes('renew'),
    );
    if (storageAddon.quantity > 0) {
      return this.OvhApiOrderCartProduct.postOptions({
        cartId: cart.cartId,
        itemId: this.environmentItemId,
        pricingMode: 'default',
        productName: 'webPaaS',
        duration: capacity.duration,
        planCode: storageAddon.planCode,
        quantity: storageAddon.quantity / STORAGE_MULTIPLE,
      }).$promise.then(() => cart);
    }
    return cart;
  }

  getOrderSummary(selectedPlan, config) {
    return this.createCart()
      .then((cart) => this.addToCart(cart.cartId, selectedPlan))
      .then((cart) => this.addConfig(cart, config))
      .then((cart) => this.addAddons(cart, selectedPlan.addons))
      .then((cart) => this.addAddonOptions(cart, selectedPlan.addons))
      .then((cart) => this.assignCart(cart))
      .then((cart) => {
        this.cart = cart;
        return this.getSummary(cart).then((order) => ({
          ...order,
          cart,
        }));
      })
      .finally(() => this.deleteCart());
  }

  getAddonSummary(project, addon, quantity) {
    if (addon.serviceName && addon.environmentServiceName === undefined) {
      return this.getUpgradeCheckoutInfo(addon.serviceName, addon, quantity);
    }

    return this.createCart()
      .then((cart) => this.assignCart(cart))
      .then((cart) => this.addItems(cart, project, addon, quantity))
      .then((cart) => {
        this.cart = cart;
        return this.getCheckoutInfo(cart).then((order) => ({
          ...order,
          cart,
        }));
      })
      .finally(() => this.deleteCart());
  }

  addItems(cart, project, addon, quantity) {
    const capacity = get(addon, 'prices').find(({ capacities }) =>
      capacities.includes('renew'),
    );
    return this.$http
      .post(
        `/order/cartServiceOption/webPaaS/${
          addon.environmentServiceName
            ? addon.environmentServiceName
            : project.serviceId
        }`,
        {
          cartId: cart.cartId,
          serviceName: addon.environmentServiceName
            ? addon.environmentServiceName
            : project.serviceId,
          duration: capacity.duration,
          planCode: addon.planCode,
          pricingMode: 'default',
          quantity: quantity || addon.quantity,
        },
      )
      .then(() => cart);
  }

  getCheckoutInfo(cart) {
    return this.OvhApiOrderCart.getCheckout({ cartId: cart.cartId }).$promise;
  }

  checkoutAddon(cart, serviceName, selectedPlan, quantity) {
    if (cart) {
      return this.goToExpressOrderOption(serviceName, selectedPlan, quantity);
    }
    return this.checkoutUpgrade(serviceName, selectedPlan, quantity);
  }

  getAdditionalOption(serviceName, project) {
    return this.$http
      .get(`/order/cartServiceOption/webPaaS/${serviceName}`)
      .then(({ data }) => {
        const environmentAddon = find(data, {
          family: ADDON_FAMILY_STAGING_ENVIRONMENT,
        });
        if (environmentAddon) {
          return this.getAdditionalOption(
            project.getEnvironmentServiceName(),
          ).then((storageAddon) => {
            data.push(storageAddon[0]);
            return map(data, (option) => new Addon(option));
          });
        }
        return map(data, (option) => new Addon(option));
      });
  }

  getSummary(cart) {
    return this.OvhApiOrderCart.summary({
      cartId: cart.cartId,
      autoPayWithPreferredPaymentMethod: true,
    }).$promise;
  }

  getUpgradeOffers(projectId) {
    return this.$http
      .get(`/order/upgrade/webPaaS/${projectId}`)
      .then(({ data }) => data);
  }

  getUpgradeCheckoutInfo(serviceName, plan, quantity) {
    return this.$http
      .get(`/order/upgrade/webPaaS/${serviceName}/${plan.planCode}`, {
        params: {
          quantity: quantity || plan.quantity,
        },
      })
      .then(({ data }) => data.order);
  }

  checkoutUpgrade(serviceName, plan, quantity) {
    return this.$http
      .post(
        `/order/upgrade/webPaaS/${
          plan.serviceName ? plan.serviceName : serviceName
        }/${plan.planCode}`,
        {
          autoPayWithPreferredPaymentMethod: true,
          quantity: quantity || plan.quantity,
        },
      )
      .then(({ data }) => data);
  }

  deleteCart() {
    return this.$http.delete(`/order/cart/${this.cart.cartId}`);
  }

  goToExpressOrderOption(serviceName, addon, quantity) {
    const params = [
      {
        productId: 'webPaaS',
        planCode: addon.planCode,
        serviceName: addon.environmentServiceName
          ? addon.environmentServiceName
          : serviceName,
        quantity: quantity || addon.quantity,
      },
    ];

    return this.goToExpressOrderUrl(params);
  }

  /**
   * Redirect to the express order page
   * @param {Object} plan [detials of the plan]
   * @param {config} array [configuration of the plan like name, region and others]
   */
  gotToExpressOrder(plan, config) {
    const params = [
      {
        productId: 'webPaaS',
        planCode: plan.planCode,
        configuration: config,
        quantity: 1,
      },
    ];

    params[0].option = compact(
      map(plan.addons, (addon) => {
        if (
          (addon.family !== ADDON_FAMILY.STORAGE && addon.quantity > 0) ||
          addon.family === ADDON_FAMILY.ENVIRONMENT
        ) {
          return {
            planCode: addon.planCode,
            quantity:
              addon.family === ADDON_FAMILY.ENVIRONMENT
                ? addon.quantity + DEFAULT_ENVIRONMENT
                : addon.quantity,
            option:
              addon.option && addon.option[0].quantity > 0 ? addon.option : '',
          };
        }
        return null;
      }),
    );
    return this.goToExpressOrderUrl(params);
  }

  goToExpressOrderUrl(payload) {
    return this.WucUser.getUrlOfEndsWithSubsidiary('express_order').then(
      (expressOrderUrl) => {
        return this.$window.open(
          `${expressOrderUrl}#/new/express/resume?products=${JSURL.stringify(
            payload,
          )}`,
          '_blank',
        );
      },
    );
  }
}
