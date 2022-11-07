import JSURL from 'jsurl';
import filter from 'lodash/filter';
import find from 'lodash/find';
import get from 'lodash/get';
import isNumber from 'lodash/isNumber';
import min from 'lodash/min';
import map from 'lodash/map';
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
  FLOATING_IP_PLAN,
} from './order.constants';
import { setDefaultSelections } from '../../../../components/project/stepper-defaults-selection/stepper-defaults-selection.utils';
import { getAutoGeneratedName } from '../../../../components/auto-generate-name/auto-generate-name';

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
    PciPublicGatewaysService,
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
    this.PciPublicGatewaysService = PciPublicGatewaysService;
    this.CucCloudMessage = CucCloudMessage;
    this.IP_TYPE_ENUM = IP_TYPE_ENUM;
    this.TRACKING_GUIDE_LINKS = TRACKING_GUIDE_LINKS;
  }

  $onInit() {
    this.currentStep = 0;
    this.user = this.coreConfig.getUser();
    this.filteredInstances = [];
    this.privateNetworks = [];
    this.gateways = [];
    this.gateway = null;
    this.snatEnabled = false;
    this.confirmAndProceed = false;
    this.gatewayPrice = null;
    this.loadingDefaultValues = false;
    this.ip = {
      quantity: 1,
      instance: null,
      region: null,
      product: null,
    };
    this.loadMessages();
    this.initIp();
    this.setDefaults();
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
        model: this.selectedGatewaySize,
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
    this.filteredInstances = filter(this.floatingIpInstances, (instance) => {
      return instance.region === regionName;
    });
  }

  initIp() {
    const {
      pricings: [{ price: floatingIpPrice = 0 }],
    } = this.publicCloudCatalog?.addons.find(
      (addon) => addon.product === FLOATING_IP_PLAN,
    );
    const failoverIpPrice = `0${this.user.currency.symbol}`;
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
        ovhSubsidiary: this.user.ovhSubsidiary,
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
      this.user.ovhSubsidiary,
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
          return this.$q.resolve({});
        }
        this.atInternet.trackPage({
          name: `${GATEWAY_TRACKING_PREFIX}::no-public-gateway`,
          type: 'navigation',
        });
        this.$timeout(() => {
          this.gatewayName = getAutoGeneratedName(
            `gateway-${this.ip?.region?.name.toLowerCase()}`,
          );
        });
        return this.PciPublicGatewaysService.getSmallestGatewayInfo(
          this.user.ovhSubsidiary,
        );
      })
      .then((data) => {
        this.selectedGatewaySize = data.size;
        this.gatewayPrice = {
          month: data.pricePerMonth,
          hour: data.pricePerHour,
        };
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

  getAdditionalIpGuideLink() {
    return (
      GUIDE_URLS.FAILOVER_IP[this.user.ovhSubsidiary] ||
      GUIDE_URLS.FAILOVER_IP.DEFAULT
    );
  }

  getAdditionalIpConfGuideLink() {
    return (
      GUIDE_URLS.CONF_FAILOVER_IP[this.user.ovhSubsidiary] ||
      GUIDE_URLS.CONF_FAILOVER_IP.DEFAULT
    );
  }

  getRegionsAvailabilityGuideLink() {
    return (
      GUIDE_URLS.REGIONS_AVAILABILITY[this.user.ovhSubsidiary] ||
      GUIDE_URLS.REGIONS_AVAILABILITY.DEFAULT
    );
  }

  setDefaults() {
    this.loadingDefaultValues = true;
    setDefaultSelections(this, DEFAULTS_MODEL, 'currentStep').finally(() => {
      this.$timeout(() => {
        this.loadingDefaultValues = false;
      });
    });
  }
}
