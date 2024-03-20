import JSURL from 'jsurl';
import filter from 'lodash/filter';
import find from 'lodash/find';
import flattenDeep from 'lodash/flattenDeep';
import get from 'lodash/get';
import head from 'lodash/head';
import intersection from 'lodash/intersection';
import last from 'lodash/last';
import map from 'lodash/map';
import range from 'lodash/range';
import uniq from 'lodash/uniq';

import {
  IP_LOCATION_GROUPS,
  PRODUCT_TYPES,
  TRACKING_PREFIX,
  VPS_MAX_QUANTITY,
  IP_AGORA,
  ADDITIONAL_IP,
  BLOCK_ADDITIONAL_IP,
  ALERT_ID,
} from '../ip-ip-agoraOrder.constant';

export default class AgoraIpV6OrderController {
  /* @ngInject */
  constructor(
    $q,
    $rootScope,
    $scope,
    $state,
    $translate,
    $window,
    Alerter,
    IpAgoraOrder,
    IpOrganisation,
    User,
    atInternet,
    coreConfig,
  ) {
    this.$q = $q;
    this.$rootScope = $rootScope;
    this.$scope = $scope;
    this.$state = $state;
    this.$translate = $translate;
    this.$window = $window;
    this.Alerter = Alerter;
    this.IpAgoraOrder = IpAgoraOrder;
    this.IpOrganisation = IpOrganisation;
    this.User = User;
    this.atInternet = atInternet;
    this.IP_AGORA = IP_AGORA;
    this.ADDITIONAL_IP = ADDITIONAL_IP;
    this.BLOCK_ADDITIONAL_IP = BLOCK_ADDITIONAL_IP;
    this.ALERT_ID = ALERT_ID;
    this.region = coreConfig.getRegion();
    this.ovhSubsidiary = coreConfig.getUser().ovhSubsidiary;
  }


  $onInit() {
    this.model = {
      params: {},
      selectedService: null,
    };
    this.loading = {};
    this.user = this.$state.params.user;
    this.catalogName = this.$state.params.catalogName;
    this.loadOptions();
  }

  loadOptions() {

  }
}
