import {
  LISTENER_PROTOCOL_LIST,
  PROTOCOLS,
  TRACKING_ADD_LISTENER,
  TRACKING_DELETE_LISTENER,
  TRACKING_ADD_INSTANCE,
  TRACKING_DELETE_INSTANCE,
} from './instances-table.constants';

export default class RegionsListController {
  /* @ngInject */
  constructor(
    $http,
    $translate,
    atInternet,
    OctaviaLoadBalancerInstanceService,
  ) {
    this.$http = $http;
    this.$translate = $translate;
    this.listenerProtocols = LISTENER_PROTOCOL_LIST;
    this.atInternet = atInternet;
    this.OctaviaLoadBalancerInstanceService = OctaviaLoadBalancerInstanceService;
  }

  $onInit() {
    this.instances = [];
    this.healthMonitorsInit();
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

  healthMonitorsInit() {
    this.listenerProtocols.forEach((listenerProtocol) => {
      if (listenerProtocol.healthMonitors) {
        listenerProtocol.healthMonitors.unshift({
          name: this.$translate.instant(
            'octavia_load_balancer_instances_table_health_monitor_empty',
          ),
          value: null,
        });
      }
    });
  }

  addListener() {
    if (!this.listeners) this.listeners = [];
    if (this.listeners.length < this.maxListener) {
      this.atInternet.trackClick({
        name: `${this.trackingPrefix}::${TRACKING_ADD_LISTENER}`,
        type: 'action',
      });
      this.listeners.push({
        instances: [{}],
      });
    }
  }

  addInstance(listener) {
    if (listener.instances.length < this.maxInstancesByListener) {
      this.atInternet.trackClick({
        name: `${this.trackingPrefix}::${TRACKING_ADD_INSTANCE}`,
        type: 'action',
      });
      listener.instances.push({});
    }
  }

  static onInstanceSelected(instance, listener) {
    const instanceModel = instance;
    instanceModel.port = RegionsListController.initInstancePort(listener);
  }

  deleteListener(index) {
    this.atInternet.trackClick({
      name: `${this.trackingPrefix}::${TRACKING_DELETE_LISTENER}`,
      type: 'action',
    });
    this.listeners.splice(index, 1);
  }

  deleteInstance(instances, index) {
    this.atInternet.trackClick({
      name: `${this.trackingPrefix}::${TRACKING_DELETE_INSTANCE}`,
      type: 'action',
    });
    instances.splice(index, 1);
  }

  static selectListenerProtocol(protocol, listener) {
    const listenerModel = listener;
    if (protocol.defaultPort) listenerModel.port = protocol.defaultPort;
  }

  static initInstancePort(listener) {
    if ([PROTOCOLS.HTTP, PROTOCOLS.HTTPS].includes(listener.protocol.value))
      return 80;
    return null;
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
}
