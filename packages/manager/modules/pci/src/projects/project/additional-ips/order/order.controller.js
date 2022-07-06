import JSURL from 'jsurl';
import filter from 'lodash/filter';
import find from 'lodash/find';
import get from 'lodash/get';
import set from 'lodash/set';
import isFunction from 'lodash/isFunction';
import isNumber from 'lodash/isNumber';
import min from 'lodash/min';
import map from 'lodash/map';
import {
  ORDER_URL,
  IP_TYPE_ENUM,
  REGIONS,
  GUIDE_URLS,
  DEFAULTS_MODEL,
} from './order.constants';

export default class AdditionalIpController {
  /* @ngInject */
  constructor(
    $q,
    $window,
    $timeout,
    $translate,
    coreConfig,
    OvhApiOrderCloudProjectIp,
    OvhApiOrderCatalogFormatted,
    additionalIpService,
    CucCloudMessage,
  ) {
    this.$q = $q;
    this.$window = $window;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.coreConfig = coreConfig;
    this.OvhApiOrderCloudProjectIp = OvhApiOrderCloudProjectIp;
    this.OvhApiOrderCatalogFormatted = OvhApiOrderCatalogFormatted;
    this.additionalIpService = additionalIpService;
    this.CucCloudMessage = CucCloudMessage;
    this.IP_TYPE_ENUM = IP_TYPE_ENUM;
  }

  $onInit() {
    this.currentStep = 0;
    this.currencySymbol = this.coreConfig.getUser().currency.symbol;
    this.allInstances = this.instances;
    this.filteredInstances = [];
    this.privateNetworks = [];
    this.gateways = [];
    this.gateway = null;
    this.snatEnabled = false;
    this.confirmAndProceed = false;
    this.gatewayPrice = null;
    this.ip = {
      quantity: 1,
      instance: null,
      region: null,
      product: null,
    };
    this.loadMessages();
    this.initIp();
    this.setDefaultSelections();
  }

  static getMaximumQuantity(product) {
    const configuration = get(product, 'details.product.default');
    const productWithMaxQuantity = filter(
      configuration,
      (p) => isNumber(p),
      'maximumQuantity',
    );
    return get(
      min(productWithMaxQuantity, 'maximumQuantity'),
      'maximumQuantity',
    );
  }

  orderFailoverIp() {
    const order = {
      planCode: this.ip.product.planCode,
      productId: 'ip',
      pricingMode: 'default',
      quantity: this.ip.quantity,
      configuration: [
        {
          label: 'country',
          value: this.ip.region,
        },
        {
          label: 'destination',
          value: this.projectId,
        },
        {
          label: 'nexthop',
          value: this.ip.instance.id,
        },
      ],
    };
    this.$window.open(
      `${get(ORDER_URL, this.coreConfig.getRegion())}${JSURL.stringify([
        order,
      ])}`,
      '_blank',
      'noopener',
    );
    this.goBack();
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe(
      'pci.projects.project.additional-ips.order',
    );
    this.messageHandler = this.CucCloudMessage.subscribe(
      'pci.projects.project.additional-ips.order',
      { onMessage: () => this.refreshMessages() },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  createFloatingIp() {
    this.creatingFloatingIp = true;
    this.additionalIpService
      .createFloatingIp(
        this.projectId,
        this.ip.region.name,
        this.ip.instance.id,
        this.ip.network.ip,
      )
      .then(() => {
        this.goBack(
          this.$translate.instant(
            'pci_additional_ip_create_floating_ip_success',
          ),
        );
      })
      .catch((error) => {
        this.CucCloudMessage.error(
          this.$translate.instant(
            'pci_additional_ip_create_floating_ip_error',
            {
              message: error.data?.message || null,
            },
          ),
        );
      })
      .finally(() => {
        this.creatingFloatingIp = false;
      });
  }

  onProductChange(ipType) {
    if (ipType.name === IP_TYPE_ENUM.FAILOVER && !this.failOverIpCountries) {
      return this.initCountries();
    }
    if (ipType.name === IP_TYPE_ENUM.FLOATING && !this.regions) {
      return this.initRegions();
    }
    return null;
  }

  onRegionChange(region) {
    if (this.selectedIpType.name === IP_TYPE_ENUM.FLOATING) {
      this.filterInstances(region.name);
    }
  }

  instanceChange(instance) {
    this.privateNetworks = filter(
      instance.ipAddresses,
      (network) => network.type === 'private',
    );
    if (this.privateNetworks.length === 1) {
      [this.ip.network] = this.privateNetworks;
    }
  }

  createAdditionalIp() {
    if (
      this.selectedIpType.name === IP_TYPE_ENUM.FAILOVER &&
      this.ip.instance
    ) {
      this.orderFailoverIp();
    } else if (this.selectedIpType.name === IP_TYPE_ENUM.FLOATING) {
      this.createFloatingIp();
    }
  }

  filterInstances(regionName) {
    this.filteredInstances = filter(this.instances, (instance) => {
      return instance.region === regionName;
    });
  }

  initIp() {
    const plan = this.getFailoverIpPlan();
    const floatingIpPrice = `${plan.pricings[0].price + plan.pricings[0].tax}${
      this.currencySymbol
    }`;
    const failoverIpPrice = `0${this.currencySymbol}`;
    this.ipTypes = map(IP_TYPE_ENUM, (type) => {
      return {
        name: type,
        label: this.$translate.instant(`pci_additional_ip_${type}`),
        description: this.$translate.instant(
          `pci_additional_ip_${type}_description`,
        ),
        price:
          type === IP_TYPE_ENUM.FLOATING ? floatingIpPrice : failoverIpPrice,
      };
    });
    [this.selectedIpType] = this.ipTypes;
    this.initCountries();
  }

  initCountries() {
    this.loadProducts().then((products) => {
      const [product] = products;
      this.ip.product = product;
      const configurations = get(product, 'details.product.configurations');
      this.failOverIpCountries = get(
        find(configurations, { name: 'country' }),
        'values',
      );
    });
  }

  loadProducts() {
    this.loadingRegions = true;
    return this.OvhApiOrderCatalogFormatted.v6()
      .get({
        catalogName: 'ip',
        ovhSubsidiary: this.coreConfig.getUser().ovhSubsidiary,
      })
      .$promise.then(({ plans }) =>
        filter(
          plans,
          (offer) =>
            /failover/.test(offer.planCode) &&
            offer.invoiceName.includes(
              get(REGIONS, this.coreConfig.getRegion()),
            ),
        ),
      )
      .finally(() => {
        this.loadingRegions = false;
      });
  }

  initRegions() {
    this.loadingRegions = true;
    return this.additionalIpService
      .getRegions(this.projectId, this.coreConfig.getUser().ovhSubsidiary)
      .then((regions) => {
        this.regions = regions;
      })
      .finally(() => {
        this.loadingRegions = false;
      });
  }

  loadGatewayDetails() {
    this.loadingGatewayDetails = true;
    this.$q
      .all({
        gateways: this.additionalIpService.getGateways(
          this.projectId,
          this.ip.region.name,
        ),
        subnets: this.additionalIpService.getNetworkSubnets(
          this.projectId,
          this.ip.network.networkId,
        ),
      })
      .then(({ gateways, subnets }) => {
        const networkSubnets = subnets.map((subnet) => subnet.id);
        this.gateways = gateways.filter((gateway) => {
          return gateway.interfaces.find((intrfce) =>
            networkSubnets.includes(intrfce.subnetId),
          );
        });
        if (this.gateways.length === 0) {
          const plan = this.getSmallestGatewayPlan();
          this.gatewayPrice = `${plan.pricings[0].price +
            plan.pricings[0].tax}${this.currencySymbol}`;
        } else {
          // there will be only one gateway with selected subnet, select the first one
          [this.gateway] = this.gateways;
          // SNAT is enabled if the gateway has externalInformation
          this.snatEnabled =
            this.gateway.externalInformation !== 'undefined' &&
            this.gateway.externalInformation !== null;
        }
      })
      .finally(() => {
        this.loadingGatewayDetails = false;
      });
  }

  getSmallestGatewayPlan() {
    return this.publicCloudCatalog.addons.find(
      (addon) => addon.product === 'publiccloud-gateway-s',
    );
  }

  showSubmitButtonOnSummaryStep() {
    return (
      this.gateways.length === 0 ||
      (this.gateways.length > 0 && this.snatEnabled) ||
      (this.gateways.length > 0 && !this.snatEnabled && this.confirmAndProceed)
    );
  }

  getFailoverIpPlan() {
    return this.publicCloudCatalog.addons.find(
      (addon) => addon.product === 'publiccloud-floatingip-floatingip',
    );
  }

  getAdditionalIpGuideLink() {
    return (
      GUIDE_URLS.FAILOVER_IP[this.coreConfig.getUser().ovhSubsidiary] ||
      GUIDE_URLS.FAILOVER_IP.DEFAULT
    );
  }

  getAdditionalIpConfGuideLink() {
    return (
      GUIDE_URLS.CONF_FAILOVER_IP[this.coreConfig.getUser().ovhSubsidiary] ||
      GUIDE_URLS.CONF_FAILOVER_IP.DEFAULT
    );
  }

  getRegionsAvailabilityGuideLink() {
    return (
      GUIDE_URLS.REGIONS_AVAILABILITY[
        this.coreConfig.getUser().ovhSubsidiary
      ] || GUIDE_URLS.REGIONS_AVAILABILITY.DEFAULT
    );
  }

  getDefaultValue(field) {
    return (
      this.defaults[field.name] !== undefined &&
      isFunction(field.getDefault) &&
      field.getDefault(this.defaults[field.name], this[field.availableOptions])
    );
  }

  onChangeAfterDefaultValueSet(methodToCall, params) {
    if (this[methodToCall] && isFunction(this[methodToCall])) {
      return this[methodToCall].call(
        this,
        ...params.map((prop) => get(this, prop)),
      );
    }
    return null;
  }

  async setDefaultSelections() {
    this.loadingDefaultValues = true;
    for (let i = 0; i < DEFAULTS_MODEL.length; i += 1) {
      const step = DEFAULTS_MODEL[i];
      for (let j = 0; j < step.fields.length; j += 1) {
        const defaultvalue = this.getDefaultValue(step.fields[j]);
        if (defaultvalue !== undefined) {
          set(this, step.fields[j].model, defaultvalue);
          // eslint-disable-next-line no-await-in-loop
          await this.onChangeAfterDefaultValueSet(
            step.fields[j].onChange,
            step.fields[j].onChangeParams,
          );
        } else {
          this.$timeout(() => {
            this.currentStep = i;
            this.loadingDefaultValues = false;
          });
          return;
        }
      }
      this.currentStep = i;
    }
    this.$timeout(() => {
      this.loadingDefaultValues = false;
    });
  }
}
