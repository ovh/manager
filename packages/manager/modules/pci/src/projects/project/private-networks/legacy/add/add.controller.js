import filter from 'lodash/filter';
import find from 'lodash/find';
import get from 'lodash/get';
import map from 'lodash/map';
import partition from 'lodash/partition';
import set from 'lodash/set';
import some from 'lodash/some';
import sortBy from 'lodash/sortBy';
import zipWith from 'lodash/zipWith';

import { DEFAULT_VLAN_ID, DEFAULT_CIDR, VLAN_ID } from './add.constants';
import IP from './ip';

const CONTAINER_NAME = 'pci.projects.project.privateNetwork.add';

export default class NetworkAddCtrl {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    CucCloudMessage,
    ovhManagerRegionService,
    OvhApiCloudProject,
    PciPrivateNetworks,
    PciPrivateNetworksAdd,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.ovhManagerRegionService = ovhManagerRegionService;
    this.OvhApiCloudProject = OvhApiCloudProject;
    this.PciPrivateNetworks = PciPrivateNetworks;
    this.PciPrivateNetworksAdd = PciPrivateNetworksAdd;
  }

  $onInit() {
    this.loaders = {
      isInitiating: true,
      isSubmitting: false,
    };
    this.configuration = {
      address: null,
      cidr: DEFAULT_CIDR,
      dhcp: true,
      vlanId: DEFAULT_VLAN_ID,
    };
    this.subnets = [];
    this.name = null;

    this.configureVlanId = false;
    this.VLAN_ID = {
      ...VLAN_ID,
      NEXT_AVAILABLE: DEFAULT_VLAN_ID,
    };

    this.regenerateNetworkAddress(DEFAULT_VLAN_ID);

    return this.$translate
      .refresh()
      .then(() => this.loadMessages())
      .then(() => this.getVlanIdConfiguration())
      .then(() => this.getSubnets())
      .catch((error) => {
        this.CucCloudMessage.error(
          this.$translate.instant(
            'pci_projects_project_network_private_create_init_error',
            { message: get(error, 'data.message', '') },
          ),
        );
      })
      .finally(() => {
        this.loaders.isInitiating = false;
      });
  }

  regenerateNetworkAddress(vlanId) {
    this.configuration.address = this.PciPrivateNetworksAdd.constructor.generateNetworkAddress(
      vlanId,
    );
    this.subnets = this.mapSubnetsIpBlocks(this.subnets);
  }

  isVlanAvailable(vlanId) {
    return !find(this.networks, { vlanId });
  }

  getVlanIdConfiguration() {
    return this.PciPrivateNetworks.getPrivateNetworks(this.projectId).then(
      (networks) => {
        this.networks = networks;
        this.configureVlanId = some(
          networks,
          ({ vlanId }) => vlanId === DEFAULT_VLAN_ID,
        );
        this.mandatoryVlanId = this.configureVlanId;
        if (this.configureVlanId) {
          const nextVlanId =
            get(
              find(
                networks,
                ({ vlanId }) =>
                  vlanId !== DEFAULT_VLAN_ID &&
                  !find(
                    networks,
                    ({ vlanId: nextId }) => nextId === vlanId + 1,
                  ),
              ),
              'vlanId',
              0,
            ) + 1;

          this.VLAN_ID = {
            MIN: Math.max(VLAN_ID.MIN, nextVlanId),
            MAX: VLAN_ID.MAX,
            NEXT_AVAILABLE: nextVlanId,
          };
          this.configuration.vlanId = this.VLAN_ID.MIN;
          this.regenerateNetworkAddress(this.configuration.vlanId);
        }
      },
    );
  }

  setVlanId(manually) {
    if (manually) {
      this.configuration.vlanId = this.VLAN_ID.MIN;
    } else {
      this.configuration.vlanId = this.VLAN_ID.NEXT_AVAILABLE;
    }
  }

  getIpBlocks(regions) {
    return IP.splitSubnetIpAddresses(
      this.configuration.address,
      this.configuration.cidr,
      regions.length,
    ).ipBlocks;
  }

  mapSubnetsIpBlocks(subnets) {
    const ipBlocks = this.getIpBlocks(subnets);
    return zipWith(sortBy(subnets, 'region'), ipBlocks, (subnet, ipBlock) => ({
      ...subnet,
      ...ipBlock,
    }));
  }

  getSubnets() {
    return this.OvhApiCloudProject.Region()
      .v6()
      .query({
        serviceName: this.projectId,
      })
      .$promise.then((regions) =>
        this.$q.all(
          map(
            regions,
            (region) =>
              this.OvhApiCloudProject.Region()
                .v6()
                .get({
                  serviceName: this.projectId,
                  id: region,
                }).$promise,
          ),
        ),
      )
      .then((regions) => {
        const supportedRegions = filter(regions, (region) =>
          some(get(region, 'services', []), { name: 'network', status: 'UP' }),
        );
        return supportedRegions.map((region) => ({
          region: region.name,
          displayedRegion: this.ovhManagerRegionService.getTranslatedMicroRegion(
            region.name,
          ),
          selected: true,
          gateway: false,
        }));
      })
      .then((subnets) => {
        this.subnets = this.mapSubnetsIpBlocks(subnets);
      });
  }

  selectRegion(selected, subnet) {
    set(subnet, 'selected', selected);
    const [selectedSubnets, unSelectedSubnets] = partition(
      this.subnets,
      'selected',
    );
    const subnets = this.mapSubnetsIpBlocks(selectedSubnets).concat(
      unSelectedSubnets,
    );
    this.subnets = subnets;
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

  createNetwork() {
    this.loaders.isSubmitting = true;

    const selectedSubnets = this.subnets.filter(({ selected }) => selected);
    const privateNetwork = {
      name: this.name,
      vlanId: this.configuration.vlanId,
      regions: selectedSubnets.map(({ region }) => region),
    };
    const subnets = selectedSubnets.map((subnet) => ({
      dhcp: this.configuration.dhcp,
      end: subnet.end,
      network: `${this.configuration.address}/${this.configuration.cidr}`,
      noGateway: !subnet.gateway,
      region: subnet.region,
      start: subnet.start,
    }));

    return this.PciPrivateNetworksAdd.create(
      this.projectId,
      privateNetwork,
      subnets,
    )
      .then(() => this.goBack())
      .then(() => {
        this.goBack(
          this.$translate.instant(
            'pci_projects_project_network_private_create_success',
          ),
        );
      })
      .catch((error) => {
        this.CucCloudMessage.error(
          this.$translate.instant(
            'pci_projects_project_network_private_create_error',
            { message: get(error, 'data.message', '') },
          ),
        );
      })
      .finally(() => {
        this.loaders.isSubmitting = false;
      });
  }
}
