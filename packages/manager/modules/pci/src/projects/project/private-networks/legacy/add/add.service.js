import { NETWORK_ACTIVE_STATUS, DEFAULT_IP } from './add.constants';

export default class {
  /* @ngInject */
  constructor(
    OvhApiCloudProjectNetworkPrivate,
    OvhApiCloudProjectNetworkPrivateSubnet,
    Poller,
  ) {
    this.OvhApiCloudProjectNetworkPrivate = OvhApiCloudProjectNetworkPrivate;
    this.OvhApiCloudProjectNetworkPrivateSubnet = OvhApiCloudProjectNetworkPrivateSubnet;
    this.Poller = Poller;
  }

  create(serviceName, privateNetwork, subnets) {
    return this.OvhApiCloudProjectNetworkPrivate.v6()
      .save(
        {
          serviceName,
        },
        privateNetwork,
      )
      .$promise.then(({ id }) =>
        this.checkPrivateNetworkCreationStatus(serviceName, id),
      )
      .then((network) => this.createSubnets(serviceName, network.id, subnets));
  }

  createSubnets(serviceName, networkId, subnets) {
    return Promise.all(
      subnets.map(
        (subnet) =>
          this.OvhApiCloudProjectNetworkPrivateSubnet.v6().save(
            {
              serviceName,
              networkId,
            },
            subnet,
          ).$promise,
      ),
    );
  }

  checkPrivateNetworkCreationStatus(serviceName, networkId) {
    this.OvhApiCloudProjectNetworkPrivate.v6().resetCache();
    return this.Poller.poll(
      `/cloud/project/${serviceName}/network/private/${networkId}`,
      {},
      {
        method: 'get',
        successRule: {
          status: NETWORK_ACTIVE_STATUS,
        },
      },
    );
  }

  static generateNetworkAddress(vlanId) {
    return DEFAULT_IP.replace('{vlanId}', vlanId % 255);
  }
}
