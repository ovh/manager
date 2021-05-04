import map from 'lodash/map';
import set from 'lodash/set';
import get from 'lodash/get';
import groupBy from 'lodash/groupBy';
import sortBy from 'lodash/sortBy';
import { find, compact } from 'lodash';
import Project from './project.class';
import Plan from './plan.class';
import PlanFamily from './family.class';
import UserLicence from './user-licence.class';

export default class WebPaasService {
  /* @ngInject */
  constructor(
    $http,
    $q,
    $translate,
    $window,
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
    return (
      this.$http
        .get('/webPaaS/subscription')
        // this.iceberg('/webPaaS/subscription')
        // .query()
        // .expand('CachedObjectList-Pages')
        // .execute({}, true)
        .then(({ data }) => {
          // temporary code to overcome issue with agora api
          // tobe removed
          const list = compact(
            map(data, (d) => {
              if (d.split('-')[0] === 'webpaas') {
                return d;
              }
              return null;
            }),
          );

          return this.$q.all(
            map(list, (d) => {
              return this.getProjectDetails(d);
            }),
          );
        })
    );
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

  getCatalog(ovhSubsidiary, availablePlans, project) {
    return this.WucOrderCartService.getProductPublicCatalog(
      ovhSubsidiary,
      'webPaaS',
    ).then((catalog) => {
      if (availablePlans) {
        catalog.plans.forEach((plan) =>
          find(availablePlans, { planCode: plan.planCode })
            ? set(plan, 'available', true)
            : null,
        );
        catalog.plans.push(project.selectedPlan);
      }
      const sorted = this.sortSetVcpuConfig(catalog.plans);
      const groupedPlans = this.groupPlans(sorted);
      set(catalog, 'plans', sorted);
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
        'product',
      ),
      (value, key) => ({ name: key, plans: value, selectedPlan: value[0] }),
    );
    return map(this.groupedPlans, (family) => new PlanFamily(family));
  }

  /**
   *
   * @param {*} catalog
   * @returns plans which have vcpuConfig text and sorted by number of cores in a plan
   */
  sortSetVcpuConfig(plans) {
    const data = map(plans, (plan) => ({
      ...plan,
      vcpuConfig: this.$translate.instant('web_paas_plan_vcpu_config_text', {
        prodCpu: get(plan, 'blobs.technical.cpu.cores'),
        stagingCpu: get(plan, 'blobs.technical.cpu.cores') / 2,
      }),
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

  getOptions(cart, plan) {
    return this.$http
      .get(`/order/cart/${cart.cartId}/webPaaS/options`, {
        params: {
          cart: cart.cartId,
          planCode: plan.planCode,
        },
      })
      .then((res) => res.data);
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
        return this.getOptions(cart, plan).then((res) => res);
      })
      .finally(() => this.deleteCart());
  }

  addAddons(cart, addons) {
    return this.$q
      .all(
        addons.forEach((addon) => {
          const capacity = get(addon, 'prices').find(({ capacities }) =>
            capacities.includes('renew'),
          );
          if (addon.quantity > 0) {
            return this.OvhApiOrderCartProduct.postOptions({
              cartId: cart.cartId,
              productName: 'webPaaS',
              duration: capacity.duration,
              planCode: addon.planCode,
              pricingMode: 'default',
              quantity: addon.quantity,
              itemId: cart.itemId,
            }).$promise;
          }
          return null;
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

  getOrderSummary(selectedPlan, config) {
    return this.createCart()
      .then((cart) => this.addToCart(cart.cartId, selectedPlan))
      .then((cart) => this.addConfig(cart, config))
      .then((cart) => this.addAddons(cart, selectedPlan.addons))
      .then((cart) => this.assignCart(cart))
      .then((cart) => {
        this.cart = cart;
        return this.getCheckoutInfo(cart).then((order) => ({
          ...order,
          cart,
        }));
      })
      .finally(() => this.deleteCart());
  }

  getAddonSummary(project, addon, quantity) {
    if (addon.serviceName) {
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
      .post(`/order/cartServiceOption/webPaaS/${project.serviceId}`, {
        cartId: cart.cartId,
        serviceName: project.serviceId,
        duration: capacity.duration,
        planCode: addon.planCode,
        pricingMode: 'default',
        quantity: quantity || addon.quantity,
      })
      .then(() => cart);
  }

  getCheckoutInfo(cart) {
    return this.OvhApiOrderCart.getCheckout({ cartId: cart.cartId }).$promise;
  }

  checkoutAddon(cart, serviceName, selectedPlan, quantity) {
    if (cart) {
      return this.goToExpressOrderOption(serviceName, selectedPlan);
    }
    return this.checkoutUpgrade(serviceName, selectedPlan, quantity);
  }

  getAdditionalOption(serviceName) {
    return this.$http
      .get(`/order/cartServiceOption/webPaaS/${serviceName}`)
      .then(({ data }) => data);
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
      .then(({ data }) => data.order);
  }

  deleteCart() {
    return this.$http.delete(`/order/cart/${this.cart.cartId}`);
  }

  goToExpressOrderOption(serviceName, addon) {
    const params = [
      {
        productId: 'webPaaS',
        planCode: addon.planCode,
        serviceName,
        quantity: addon.quantity,
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
        if (addon.quantity > 0) {
          return {
            planCode: addon.planCode,
            quantity: addon.quantity,
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
        this.$window.open(
          `${expressOrderUrl}#/new/express/resume?products=${JSURL.stringify(
            payload,
          )}`,
          '_blank',
        );
      },
    );
  }
}
