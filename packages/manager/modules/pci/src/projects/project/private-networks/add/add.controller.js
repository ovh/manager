import {
  DEFAULT_VLAN_ID,
  VLAN_ID,
  GUIDE_LINKS,
  DEFAULT_CIDR,
  TRACKING_PREFIX,
} from './add.constants';
import { getAutoGeneratedName } from '../../../../components/auto-generate-name/auto-generate-name';

const CONTAINER_NAME = 'pci.projects.project.privateNetwork.add';

export default class PrivateNetworksAddCtrl {
  /* @ngInject */
  constructor(
    $q,
    $timeout,
    $translate,
    coreConfig,
    CucCloudMessage,
    PciPrivateNetworks,
    PciPrivateNetworksAdd,
    PciPublicGatewaysService,
  ) {
    this.$q = $q;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.coreConfig = coreConfig;
    this.CucCloudMessage = CucCloudMessage;
    this.PciPrivateNetworks = PciPrivateNetworks;
    this.PciPrivateNetworksAdd = PciPrivateNetworksAdd;
    this.PciPublicGatewaysService = PciPublicGatewaysService;
    this.GUIDE_LINKS = GUIDE_LINKS;
    this.VLAN_ID = VLAN_ID;
    this.TRACKING_PREFIX = TRACKING_PREFIX;
  }

  $onInit() {
    this.loaders = {
      isInitiating: false,
      configStep: false,
      isSubmitting: false,
    };
    this.configuration = {
      region: null,
      createGateway: false,
      vlanId: DEFAULT_VLAN_ID,
      cidr: DEFAULT_CIDR,
      dhcp: true,
      enableGatewayIp: false,
    };
    this.isGatewayAvailableInRegion = false;
    this.getAvailableRegions();
    this.loadMessages();
    this.regenerateNetworkAddress(DEFAULT_VLAN_ID);
    this.user = this.coreConfig.getUser();
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe(CONTAINER_NAME);
    this.messageHandler = this.CucCloudMessage.subscribe(CONTAINER_NAME, {
      onMessage: () => this.refreshMessages(),
    });
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  getAvailableRegions() {
    this.loaders.isInitiating = true;
    return this.PciPrivateNetworksAdd.getAllRegions(this.projectId)
      .then((regions) =>
        this.$q.all(
          regions.map((region) =>
            this.PciPrivateNetworksAdd.getRegionInfo(this.projectId, region),
          ),
        ),
      )
      .then((regions) => {
        this.regions = regions
          .filter(({ services = [] }) =>
            services.some(
              (service) =>
                service.name === 'network' && service.status === 'UP',
            ),
          )
          .map(({ name, datacenterLocation: datacenter, continentCode }) => ({
            name,
            continentCode,
            datacenter,
            hasEnoughQuota: () => true,
          }));
      })
      .finally(() => {
        this.loaders.isInitiating = false;
      });
  }

  trackGatewayBanners() {
    let name;
    if (this.gateway) {
      name = this.gateway.externalInformation
        ? 'with-public-gateway'
        : 'with-public-gateway-snat-disabled';
    } else {
      name = 'no-public-gateway';
    }
    this.trackPrivateNetworks(
      `${TRACKING_PREFIX}::warning-banner::${name}`,
      'page',
      false,
    );
  }

  trackCheckBoxClick(value, name) {
    const type = value ? 'enable' : 'disable';
    this.trackPrivateNetworks(
      `${TRACKING_PREFIX}::checkbox-${name}::${type}`,
      'action',
      false,
    );
  }

  onCreateGatewayChange(modelValue) {
    this.trackCheckBoxClick(modelValue, 'create-public-gateway');
    if (modelValue) {
      this.configuration.dhcp = true;
      this.configuration.enableGatewayIp = true;
    }
  }

  onSetVlanIdChange(modelValue) {
    this.trackCheckBoxClick(modelValue, 'set-vlan-id');
    if (modelValue) {
      this.configuration.vlanId = this.VLAN_ID.MIN;
    } else {
      this.configuration.vlanId = this.VLAN_ID.NEXT_AVAILABLE;
    }
  }

  onEnableDhcpChange(modelValue) {
    this.trackCheckBoxClick(modelValue, 'dhcp-distribution');
  }

  onDefaultGatewayChange(modelValue) {
    this.trackCheckBoxClick(modelValue, 'announce-address');
  }

  onConfigurePrivateNetworkInit() {
    this.loaders.configStep = true;
    this.configuration.createGateway = false;
    return this.$q
      .all([this.loadNetworkDetails(), this.loadGatewayDetails()])
      .finally(() => {
        this.loaders.configStep = false;
      });
  }

  loadNetworkDetails() {
    return this.PciPrivateNetworks.getPrivateNetworks(this.projectId).then(
      (networks) => {
        this.networks = networks;
        this.configureVlanId = !this.isVlanAvailable(DEFAULT_VLAN_ID);
        this.mandatoryVlanId = this.configureVlanId;
        if (this.configureVlanId) {
          const nextVlanId = this.getNextAvailableVlanId();
          this.VLAN_ID = {
            MIN: VLAN_ID.MIN,
            MAX: VLAN_ID.MAX,
            NEXT_AVAILABLE: nextVlanId,
          };
          this.configuration.vlanId = this.VLAN_ID.NEXT_AVAILABLE;
          this.regenerateNetworkAddress(this.configuration.vlanId);
        }
      },
    );
  }

  getNextAvailableVlanId() {
    const network = this.networks.find(
      ({ vlanId }) =>
        vlanId !== DEFAULT_VLAN_ID &&
        !this.networks.some(({ vlanId: nextId }) => nextId === vlanId + 1),
    );
    return network ? network.vlanId + 1 : VLAN_ID.MIN;
  }

  regenerateNetworkAddress(vlanId) {
    this.configuration.address = this.PciPrivateNetworksAdd.constructor.generateNetworkAddress(
      vlanId,
    );
  }

  isVlanAvailable(checkVlanId) {
    return this.networks?.every(({ vlanId }) => vlanId !== checkVlanId);
  }

  loadGatewayDetails() {
    return this.PciPublicGatewaysService.getGateways(
      this.projectId,
      this.configuration.region?.name,
    )
      .then((gateways) => {
        this.isGatewayAvailableInRegion = true;
        this.gateway = gateways.find(
          ({ externalInformation }) => externalInformation,
        );
        if (!this.gateway && gateways.length) {
          [this.gateway] = gateways;
        } else {
          this.gatewayName = getAutoGeneratedName(
            `gateway-${this.configuration.region?.name.toLowerCase()}`,
          );
          this.$timeout(() => {
            this.PciPublicGatewaysService.getSmallestGatewayInfo(
              this.user.ovhSubsidiary,
            ).then((data) => {
              this.gatewaySize = data.size;
              this.gatewayPrice = {
                month: data.pricePerMonth,
                hour: data.pricePerHour,
              };
            });
          });
        }
      })
      .catch(() => {
        this.isGatewayAvailableInRegion = false;
      });
  }

  onSummaryStepInit() {
    this.trackGatewayBanners();
  }

  enableSnatOnGateway() {
    if (
      this.configuration.createGateway &&
      this.gateway &&
      !this.gateway.externalInformation &&
      this.enableSNAT
    ) {
      return this.PciPublicGatewaysService.enableSnatOnGateway(
        this.projectId,
        this.configuration.region?.name,
        this.gateway.id,
      );
    }
    return this.$q.resolve();
  }

  createPrivateNetwork() {
    let gateway;
    let vlanId;
    if (this.configuration.createGateway && !this.gateway) {
      gateway = {
        name: this.gatewayName,
        model: this.gatewaySize,
      };
    }
    if (this.configureVlanId) {
      vlanId = this.configuration.vlanId;
    }
    const subnet = {
      cidr: `${this.configuration.address}/${this.configuration.cidr}`,
      ipVersion: 4,
      enableDhcp: this.configuration.dhcp,
      enableGatewayIp: this.configuration.enableGatewayIp,
    };
    return this.PciPrivateNetworksAdd.create(
      this.projectId,
      this.configuration.region?.name,
      this.privateNetworkName,
      subnet,
      vlanId,
      gateway,
    );
  }

  associateNetworkToGateway(subnet) {
    if (this.configuration.createGateway && this.gateway) {
      return this.PciPrivateNetworksAdd.associateGatewayToNetwork(
        this.projectId,
        this.configuration.region?.name,
        this.gateway.id,
        subnet.id,
      );
    }
    return this.$q.resolve();
  }

  onCreatePrivateNetworkClick() {
    this.loaders.isSubmitting = true;
    this.trackPrivateNetworks(
      `confirm-add-private-network::${this.configuration.region?.name}`,
      'action',
      false,
    );
    this.$q
      .all([this.createPrivateNetwork(), this.enableSnatOnGateway()])
      .then(([[subnetDetails]]) =>
        this.associateNetworkToGateway(subnetDetails),
      )
      .then(() => {
        return this.goBack(
          this.$translate.instant(
            'pci_projects_project_network_private_create_success',
          ),
        );
      })
      .catch((error) => {
        this.CucCloudMessage.error(
          this.$translate.instant(
            'pci_projects_project_network_private_create_error',
            { message: error?.data?.message },
          ),
        );
      })
      .finally(() => {
        this.loaders.isSubmitting = false;
      });
  }
}
