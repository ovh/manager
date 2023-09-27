import {
  LISTENER_PROTOCOL_LIST,
  PROTOCOLS,
  TRACKING_ADD_LISTENER,
} from './instances-table.constants';

export default class RegionsListController {
  /* @ngInject */
  constructor($http, atInternet, OctaviaLoadBalancerInstanceService) {
    this.$http = $http;
    this.listenerProtocols = LISTENER_PROTOCOL_LIST;
    this.atInternet = atInternet;
    this.OctaviaLoadBalancerInstanceService = OctaviaLoadBalancerInstanceService;
    this.addInstance = RegionsListController.addInstance;
    this.deleteListener = RegionsListController.deleteListener;
    this.selectListenerProtocol = RegionsListController.selectListenerProtocol;
    this.isPoolSectionDisabled = RegionsListController.isPoolSectionDisabled;
  }

  $onInit() {
    this.listeners = [];
    this.instances = [];
  }

  $onChanges(changes) {
    if (changes.region.currentValue?.name) {
      this.OctaviaLoadBalancerInstanceService.getRegionInstances(
        this.projectId,
        changes.region.currentValue.name,
      ).then((instances) => {
        this.instances = instances;
      });
    }
  }

  addListener() {
    if (this.listeners.length < 5) {
      this.atInternet.trackClick({
        name: TRACKING_ADD_LISTENER,
        type: 'action',
      });
      this.listeners.push({
        instances: [{}],
      });
    }
  }

  static addInstance(listener) {
    listener.instances.push({});
  }

  static deleteListener(index) {
    this.listeners.splice(index, 1);
  }

  static selectListenerProtocol(protocol, listener) {
    // eslint-disable-next-line no-param-reassign
    listener.port = protocol.defaultPort;
  }

  static isPoolSectionDisabled(listener) {
    if (
      listener.protocol &&
      listener.protocol.value !== PROTOCOLS.PROMETHEUS &&
      listener.port
    ) {
      return false;
    }
    return true;
  }

  // selectHealthMonitor(healthMonitor, listener) {
  // console.log(listener);
  // console.log(healthMonitor);
  // }
}
