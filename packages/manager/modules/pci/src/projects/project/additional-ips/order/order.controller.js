import JSURL from 'jsurl';
import filter from 'lodash/filter';
import find from 'lodash/find';
import get from 'lodash/get';
import set from 'lodash/set';
import isFunction from 'lodash/isFunction';
import isNumber from 'lodash/isNumber';
import min from 'lodash/min';
import map from 'lodash/map';
import last from 'lodash/last';
import { TABS } from '../additional-ips.constants';
import {
  ORDER_URL,
  IP_TYPE_ENUM,
  REGIONS,
  GUIDE_URLS,
  DEFAULTS_MODEL,
  GATEWAY_TRACKING_PREFIX,
  TRACKING_PREFIX_FORM_SUBMIT,
  TRACKING_GUIDE_LINKS,
} from './order.constants';

export default class AdditionalIpController {
  /* @ngInject */
  constructor(
    $q,
    $window,
    $timeout,
    $translate,
    atInternet,
    coreConfig,
    OvhApiOrderCloudProjectIp,
    OvhApiOrderCatalogFormatted,
    PciProjectAdditionalIpService,
    CucCloudMessage,
  ) {
    this.$q = $q;
    this.$window = $window;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.coreConfig = coreConfig;
    this.OvhApiOrderCloudProjectIp = OvhApiOrderCloudProjectIp;
    this.OvhApiOrderCatalogFormatted = OvhApiOrderCatalogFormatted;
    this.PciProjectAdditionalIpService = PciProjectAdditionalIpService;
    this.CucCloudMessage = CucCloudMessage;
    this.IP_TYPE_ENUM = IP_TYPE_ENUM;
    this.TRACKING_GUIDE_LINKS = TRACKING_GUIDE_LINKS;
  }

  $onInit() {
    this.currentStep = 0;
    this.currencySymbol = this.coreConfig.getUser().currency.symbol;
    this.ovhSubsidiary = this.coreConfig.getUser().ovhSubsidiary;
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

  onAdditionalIpTypeSubmit() {
    this.trackClick(`${TRACKING_PREFIX_FORM_SUBMIT}-usage`, false);
  }

  onRegionFormSubmit() {
    this.trackClick(`${TRACKING_PREFIX_FORM_SUBMIT}-region`, false);
  }

  orderFailoverIp() {
    this.trackClick(
      `confirm-add-additional-ip::failover-ip::${this.ip.region}`,
      false,
    );
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
    this.trackClick(
      `confirm-add-additional-ip::floating-ip::${this.ip.region.name}`,
      false,
    );
    this.creatingFloatingIp = true;
    let gateway;
    if (this.gateways.length === 0) {
      gateway = {
        name: this.gatewayName,
        model: last(this.selectedGatewaySize.product.split('-')),
      };
    }
    this.PciProjectAdditionalIpService.createFloatingIp(
      this.projectId,
      this.ip.region.name,
      this.ip.instance.id,
      this.ip.network.ip,
      gateway,
    )
      .then(() => {
        this.goBack(
          this.$translate.instant(
            'pci_additional_ip_create_floating_ip_success',
          ),
          'success',
          TABS.FLOATING_IP,
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
      return this.orderFailoverIp();
    }
    if (
      this.selectedIpType.name === IP_TYPE_ENUM.FLOATING &&
      this.gateway &&
      !this.snatEnabled
    ) {
      return this.AdditionalIpService.enableSnatOnGateway(
        this.projectId,
        this.ip.region.name,
        this.gateway.id,
      ).then(() => this.createFloatingIp());
    }
    return this.createFloatingIp();
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
        ovhSubsidiary: this.ovhSubsidiary,
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
    return this.PciProjectAdditionalIpService.getRegions(
      this.projectId,
      this.coreConfig.getUser().ovhSubsidiary,
    )
      .then((regions) => {
        this.regions = regions;
      })
      .finally(() => {
        this.loadingRegions = false;
      });
  }

  loadGatewayDetails() {
    this.trackClick('additional-ips_add_select-attachment', false);
    this.loadingGatewayDetails = true;
    this.$q
      .all({
        gateways: this.PciProjectAdditionalIpService.getGateways(
          this.projectId,
          this.ip.region.name,
        ),
        subnets: this.PciProjectAdditionalIpService.getNetworkSubnets(
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
        if (this.gateways.length > 0) {
          // there will be only one gateway with selected subnet, select the first one
          [this.gateway] = this.gateways;
          // SNAT is enabled if the gateway has externalInformation
          this.snatEnabled =
            this.gateway.externalInformation !== 'undefined' &&
            this.gateway.externalInformation !== null;
          this.atInternet.trackPage({
            name: `${GATEWAY_TRACKING_PREFIX}::${
              this.snatEnabled
                ? 'with-public-gateway'
                : 'with-public-gateway-snat-disabled'
            }`,
            type: 'navigation',
          });
        } else {
          this.atInternet.trackPage({
            name: `${GATEWAY_TRACKING_PREFIX}::no-public-gateway`,
            type: 'navigation',
          });
        }
      })
      .finally(() => {
        this.loadingGatewayDetails = false;
      });
  }

  showSubmitButtonOnSummaryStep() {
    return (
      (this.gateways.length === 0 &&
        this.gatewayName &&
        this.selectedGatewaySize) ||
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
      GUIDE_URLS.FAILOVER_IP[this.ovhSubsidiary] ||
      GUIDE_URLS.FAILOVER_IP.DEFAULT
    );
  }

  getAdditionalIpConfGuideLink() {
    return (
      GUIDE_URLS.CONF_FAILOVER_IP[this.ovhSubsidiary] ||
      GUIDE_URLS.CONF_FAILOVER_IP.DEFAULT
    );
  }

  getRegionsAvailabilityGuideLink() {
    return (
      GUIDE_URLS.REGIONS_AVAILABILITY[this.ovhSubsidiary] ||
      GUIDE_URLS.REGIONS_AVAILABILITY.DEFAULT
    );
  }

  getDefaultValue(field) {
    let defaultValue;
    if (this.defaults[field.name] !== undefined) {
      defaultValue =
        isFunction(field.getDefault) &&
        field.getDefault(
          this.defaults[field.name],
          this[field.availableOptions],
        );
    }
    return defaultValue;
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

  onGatewayModelSelection(gateway) {
    this.selectedGatewaySize = gateway;
  }
}
