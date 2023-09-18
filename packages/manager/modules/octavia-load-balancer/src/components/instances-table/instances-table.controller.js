import {
  LISTENER_PROTOCOL_LIST,
  TRACKING_ADD_LISTENER,
} from './instances-table.constants';

export default class RegionsListController {
  /* @ngInject */
  constructor(atInternet) {
    this.listenerProtocols = LISTENER_PROTOCOL_LIST;
    this.atInternet = atInternet;
  }

  $onInit() {
    this.listeners = [];
  }

  addListener() {
    this.atInternet.trackClick({
      name: TRACKING_ADD_LISTENER,
      type: 'action',
    });
    this.listeners.push({});
  }

  deleteListener(index) {
    this.listeners.splice(index, 1);
  }
}
