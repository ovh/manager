import get from 'lodash/get';
import set from 'lodash/set';
import { getCriteria } from '../project.utils';
import { PRIVATE_NETWORK_LIST, PAGINATION } from './private-networks.constants';

const CONTAINER_NAME = 'pci.projects.project.privateNetwork';

export default class {
  /* @ngInject */
  constructor(
    $translate,
    CucCloudMessage,
    OvhApiCloudProjectNetworkPrivateSubnet,
    PciPrivateNetworks,
  ) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.OvhApiCloudProjectNetworkPrivateSubnet = OvhApiCloudProjectNetworkPrivateSubnet;
    this.PciPrivateNetworks = PciPrivateNetworks;
    this.PRIVATE_NETWORK_LIST = PRIVATE_NETWORK_LIST;
    this.offset = PAGINATION.OFFSET;
    this.pageSize = PAGINATION.PAGESIZE;
  }

  $onInit() {
    this.loadMessages();
    this.isSubnetsLoading = false;
    this.isRowExpanded = {};
    this.criteria = getCriteria('id', this.networkId);
    this.originalList = [...this.privateNetworks];
    this.paginate(this.pageSize, this.offset);
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

  expandRow($row) {
    this.isRowExpanded[$row.id] = !this.isRowExpanded[$row.id];
    if (this.isRowExpanded[$row.id] && !$row.subnets) {
      return this.getSubnets($row);
    }
    return null;
  }

  getSubnets($row) {
    this.isSubnetsLoading = true;
    return this.PciPrivateNetworks.getSubnets(this.projectId, $row.id)
      .then(({ data }) =>
        set(
          $row,
          'subnets',
          data.map((subnet) => ({
            ...subnet,
            allocatedIp: subnet.ipPools
              .map((ipPool) => `${ipPool.start} - ${ipPool.end}`)
              .join(' ,'),
            dhcp: subnet.ipPools
              .map((ipPool) =>
                ipPool.dhcp === true
                  ? this.$translate.instant(
                      'pci_projects_project_network_private_dhcp_active',
                    )
                  : this.$translate.instant(
                      'pci_projects_project_network_private_dhcp_suspended',
                    ),
              )
              .join(),
          })),
        ),
      )
      .catch((error) => this.CucCloudMessage.error(get(error, 'data.message')))
      .finally(() => {
        this.isSubnetsLoading = false;
      });
  }

  onChange({ offset, pageSize }) {
    this.paginate(pageSize, offset);
  }

  paginate(pageSize, offset) {
    this.privateNetworks = this.originalList.slice(
      offset - 1,
      offset + pageSize - 1,
    );
  }
}
