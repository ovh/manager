import get from 'lodash/get';
import { setDefaultSelections } from '../../setStepperDefaults.utils';
import {
  PUBLIC_GATEWAYS_READ_MORE_GUIDE,
  REGIONS_AVAILABILITY_URL,
  AVAILABLE_SUBNET,
  DEFAULT_IPVERSION,
  DEFAULTS_MODEL,
} from './add.constants';

export default class PciPublicGatewaysAddController {
  /* @ngInject */
  constructor(
    $timeout,
    $translate,
    coreConfig,
    PciPublicGatewaysService,
    CucCloudMessage,
  ) {
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.user = coreConfig.getUser();
    this.addPublicGatewaysReadMoreUrl =
      PUBLIC_GATEWAYS_READ_MORE_GUIDE.ALL_GUIDE[this.user.ovhSubsidiary] ||
      PUBLIC_GATEWAYS_READ_MORE_GUIDE.ALL_GUIDE.DEFAULT;
    this.regionAvailabilityUrl = REGIONS_AVAILABILITY_URL;
    this.PciPublicGatewaysService = PciPublicGatewaysService;
    this.CucCloudMessage = CucCloudMessage;
    this.availableSubnet = AVAILABLE_SUBNET;
  }

  $onInit() {
    this.currentStep = 0;
    this.gatewayModel = {};
    this.privateNetworkModel = {};
    this.isLoading = false;
    this.selectedRegion = null;
    this.displaySelectedRegion = false;
    this.displaySelectedGateway = false;
    this.selectedGatewaySize = null;
    this.showAddPrivateNetworkModalForm = false;
    this.privateNetworks = null;
    this.networkSubnet = null;
    this.gatewayName = null;
    this.loadingDefaultValues = false;

    this.selectedPrivateNetwork = this.getDefaultSelectValue(
      'pci_projects_project_public_gateways_add_select_private_network',
    );
    this.selectedSubnet = this.getDefaultSelectValue(
      'pci_projects_project_public_gateways_add_modal_add_private_network_select_label',
    );
    this.loadMessages();
    if (this.hasDefaultParams()) {
      setDefaultSelections(this, DEFAULTS_MODEL, this.loadingDefaultValues);
    }
  }

  hasDefaultParams() {
    return !!(
      this.defaults.network &&
      this.defaults.subnet &&
      this.defaults.region
    );
  }

  getDefaultSelectValue(transKey) {
    return {
      id: '',
      name: this.$translate.instant(transKey),
    };
  }

  onGatewaySizeFocus() {
    this.displaySelectedGateway = false;
  }

  onGatewaySizeChange() {
    this.trackPublicGateways('add::public-gateway_add_select-type');
    this.displaySelectedGateway = true;
  }

  onRegionsFocus() {
    this.displaySelectedRegion = false;
  }

  onRegionChange(region) {
    this.trackPublicGateways('add::public-gateway_add_select-region');
    this.displaySelectedRegion = true;
    this.selectedRegion = region;
    return this.getSelectedRegionNetwork(
      this.projectId,
      this.selectedRegion.name,
    );
  }

  getSelectedRegionNetwork(projectId, regionName) {
    return this.PciPublicGatewaysService.getPrivateNetworks(
      projectId,
      regionName,
    )
      .then((network) => {
        this.privateNetworks = network;
      })
      .catch((error) => this.CucCloudMessage.error(get(error, 'data.message')));
  }

  onGatewaySizeSelect(gateway) {
    this.selectedGatewaySize = gateway;
  }

  onAddPrivateNetworkClick() {
    this.trackPublicGateways('add::add-private-network');
    this.showAddPrivateNetworkModalForm = true;
  }

  onCancel() {
    this.trackPublicGateways('add::add-private-network::cancel');
    this.showAddPrivateNetworkModalForm = false;
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe(
      'pci.projects.project.public-gateways.add',
    );
    this.messageHandler = this.CucCloudMessage.subscribe(
      'pci.projects.project.public-gateways.add',
      {
        onMessage: () => this.refreshMessages(),
      },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  getGatewayModel = (gatewaySize) => gatewaySize.split(/[-]+/).pop();

  getNetworkSubnet(projectId, regionName, networkId) {
    this.PciPublicGatewaysService.getSubnet(projectId, regionName, networkId)
      .then((subnet) => {
        this.networkSubnet = subnet;
      })
      .catch((error) => this.CucCloudMessage.error(get(error, 'data.message')));
  }

  getSubnetById(projectId, regionName, networkId, subnetId) {
    this.PciPublicGatewaysService.getSubnetById(
      projectId,
      regionName,
      networkId,
      subnetId,
    )
      .then((subnet) => {
        this.networkSubnet = [subnet];
      })
      .catch((error) => this.CucCloudMessage.error(get(error, 'data.message')));
  }

  onPrivateNetworkChange(selectedNetwork) {
    this.trackPublicGateways('add::public-gateway_add_add-private-network');
    if (this.hasDefaultParams()) {
      return this.getSubnetById(
        this.projectId,
        this.defaults.region,
        selectedNetwork.id,
        this.defaults.subnet,
      );
    }
    return this.getNetworkSubnet(
      this.projectId,
      this.selectedRegion.name,
      selectedNetwork.id,
    );
  }

  onAddPrivateNetworkFormSubmit() {
    this.trackPublicGateways('add::add-private-network::confirm');
    this.isLoading = true;
    this.privateNetworkModel = {
      gateway: {
        name: this.gatewayName,
        model: this.getGatewayModel(this.selectedGatewaySize.product),
      },
      name: this.privateNetworkModel.name,
      subnet: {
        cidr: this.selectedSubnet,
        ipVersion: DEFAULT_IPVERSION,
      },
    };
    this.PciPublicGatewaysService.addPrivateNetwork(
      this.projectId,
      this.selectedRegion.name,
      this.privateNetworkModel,
    )
      .then((data) => {
        this.privateNetworks.push(data);
        this.selectedPrivateNetwork = data.name;
        this.getNetworkSubnet(
          this.projectId,
          this.selectedRegion.name,
          data.network.id,
        );
        this.showAddPrivateNetworkModalForm = false;
      })
      .catch((err) => {
        this.showAddPrivateNetworkModalForm = false;
        this.CucCloudMessage.error(
          this.$translate.instant(
            'pci_projects_project_public_gateways_add_modal_add_private_network_error',
            { message: get(err, 'data.message', '') },
          ),
        );
      })
      .finally(() => {
        this.loading = false;
      });
  }

  add() {
    this.trackPublicGateways(
      `add::confirm-add-public-gateway::${this.selectedGatewaySize.product}::${this.selectedRegion.datacenter.name}`,
    );
    this.loading = true;
    this.gatewayModel = {
      name: this.gatewayName,
      model: this.getGatewayModel(this.selectedGatewaySize.product),
      network: {
        name: this.selectedPrivateNetwork.name,
        subnet: {
          cidr: this.networkSubnet[0].cidr,
          ipVersion: DEFAULT_IPVERSION,
        },
      },
    };
    return this.PciPublicGatewaysService.addGateway(
      this.projectId,
      this.selectedRegion.name,
      this.gatewayModel,
    )
      .then(() => {
        if (
          this.defaults.network &&
          this.defaults.subnet &&
          this.defaults.region
        ) {
          return this.goToPrivateNetwork(this.projectId);
        }
        return this.goToPublicGateway(
          this.$translate.instant(
            'pci_projects_project_public_gateways_add_success',
          ),
        );
      })
      .catch((err) => {
        return this.CucCloudMessage.error(
          this.$translate.instant(
            'pci_projects_project_public_gateways_add_error',
            { message: get(err, 'data.message', '') },
          ),
        );
      })
      .finally(() => {
        this.loading = false;
      });
  }
}
