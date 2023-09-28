import {
  LISTENER_PROTOCOL_LIST,
  MAX_INSTANCES_BY_LISTENER,
  MAX_LISTENER,
  PROTOCOLS,
  TRACKING_ADD_LISTENER,
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

    this.maxListener = MAX_LISTENER;
    this.maxInstancesByListener = MAX_INSTANCES_BY_LISTENER;
  }

  $onInit() {
    if (!this.listeners) this.listeners = [];
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
    if (this.listeners.length < MAX_LISTENER) {
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
    if (listener.instances.length < MAX_INSTANCES_BY_LISTENER) {
      listener.instances.push({});
    }
  }

  static onInstanceSelected(instance, listener) {
    const instanceModel = instance;
    instanceModel.port = RegionsListController.initInstancePort(listener);
  }

  deleteListener(index) {
    this.listeners.splice(index, 1);
  }

  static deleteInstance(instances, index) {
    instances.splice(index, 1);
  }

  static selectListenerProtocol(protocol, listener) {
    const listenerModel = listener;
    if (!listenerModel.port) listenerModel.port = protocol.defaultPort;
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
