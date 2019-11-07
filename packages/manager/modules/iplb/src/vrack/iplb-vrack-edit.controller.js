import filter from 'lodash/filter';
import find from 'lodash/find';
import forEach from 'lodash/forEach';
import includes from 'lodash/includes';
import keys from 'lodash/keys';
import map from 'lodash/map';
import set from 'lodash/set';

export default class IpLoadBalancerVrackEditCtrl {
  /* @ngInject */
  constructor($q, $stateParams, $translate, CucCloudMessage, CucCloudNavigation,
    CucControllerHelper, IpLoadBalancerServerFarmService, IpLoadBalancerVrackService) {
    this.$q = $q;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.CucCloudNavigation = CucCloudNavigation;
    this.CucControllerHelper = CucControllerHelper;
    this.IpLoadBalancerServerFarmService = IpLoadBalancerServerFarmService;
    this.IpLoadBalancerVrackService = IpLoadBalancerVrackService;

    this.serviceName = $stateParams.serviceName;
    this.networkId = $stateParams.networkId;

    this.initLoaders();
    this.initModel();
  }

  $onInit() {
    this.previousState = this.CucCloudNavigation.getPreviousState();
    this.creationRules.load();
    this.privateNetwork.load()
      .then(() => {
        if (keys(this.privateNetwork.data).length) {
          forEach(keys(this.model), (key) => {
            this.model[key].value = this.privateNetwork.data[key];
          });
        }

        return this.privateNetworkFarms.load();
      })
      .then(() => {
        if (!this.privateNetworkFarms.data.length) {
          this.addFarm();
          return;
        }

        forEach(this.privateNetworkFarms.data, (farm) => {
          set(farm, 'displayName', farm.displayName || farm.farmId);
        });
        this.model.farmId.value = this.privateNetworkFarms.data;
      });

    this.farms.load()
      .then(() => {
        forEach(this.farms.data, (farm) => {
          set(farm, 'displayName', farm.displayName || farm.farmId);
        });
      });
  }

  submit() {
    if (this.form.$invalid) {
      return this.$q.reject();
    }

    this.saving = true;
    this.CucCloudMessage.flushChildMessage();
    return (!this.editing() ? this.addNetwork() : this.editNetwork())
      .then(() => this.previousState.go())
      .finally(() => { this.saving = false; });
  }

  isLoading() {
    return this.privateNetwork.loading || this.creationRules.loading;
  }

  editing() {
    return this.networkId;
  }

  getAvailableFarm(forceValue) {
    const filteredValue = filter(
      this.farms.data,
      farm => !includes(map(this.model.farmId.value, value => value.farmId), farm.farmId),
    );
    if (forceValue) {
      filteredValue.push(find(this.farms.data, farm => farm.farmId === forceValue));
    }
    return filteredValue;
  }

  canAddFarm() {
    const availableFarmCount = this.getAvailableFarm().length;
    return availableFarmCount > 0 && this.model.farmId.value.length < this.farms.data.length;
  }

  addFarm() {
    this.model.farmId.value.push({
      farmId: null,
      displayName: null,
    });
  }

  removeFarm(index) {
    this.model.farmId.value.splice(index, 1);
  }

  addNetwork() {
    return this.IpLoadBalancerVrackService
      .addPrivateNetwork(this.serviceName, this.getCleanModel());
  }

  editNetwork() {
    return this.IpLoadBalancerVrackService
      .editPrivateNetwork(this.serviceName, this.getCleanModel());
  }

  getCleanModel() {
    const cleanModel = {};
    forEach(keys(this.model), (key) => {
      if (!this.model[key].disabled()) {
        switch (key) {
          case 'farmId':
            cleanModel[key] = map(
              filter(this.model[key].value, farm => farm.farmId),
              farm => farm.farmId,
            );
            break;
          default:
            cleanModel[key] = this.model[key].value;
        }
      }
    });

    cleanModel.vrackNetworkId = this.networkId;
    return cleanModel;
  }

  initLoaders() {
    this.creationRules = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () => this.IpLoadBalancerVrackService
        .getNetworkCreationRules(this.serviceName),
    });

    this.privateNetwork = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () => (this.editing() ? this.IpLoadBalancerVrackService
        .getPrivateNetwork(this.serviceName, this.networkId) : this.$q.when({})),
    });

    this.privateNetworkFarms = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () => (this.editing() ? this.IpLoadBalancerVrackService
        .getPrivateNetworkFarms(this.serviceName, this.networkId) : this.$q.when([])),
    });

    this.farms = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () => this.IpLoadBalancerServerFarmService.getServerFarms(this.serviceName),
    });
  }

  initModel() {
    this.model = {
      displayName: {
        id: 'displayName',
        label: this.$translate.instant('iplb_vrack_private_network_add_edit_field_display_name_label'),
        type: 'text',
        value: undefined,
        required: false,
        minLength: 0,
        maxLength: 100,
        disabled: () => this.creationRules.data.status !== 'active',
        inputSize: 4,
      },
      vlan: {
        id: 'vlan',
        label: this.$translate.instant('iplb_vrack_private_network_add_edit_field_vlan_label'),
        type: 'number',
        value: undefined,
        required: false,
        minLength: 0,
        maxLength: Infinity,
        disabled: () => this.creationRules.data.status !== 'active',
        helperText: this.$translate.instant('iplb_vrack_private_network_add_edit_field_vlan_helper'),
        inputSize: 1,
      },
      subnet: {
        id: 'subnet',
        label: this.$translate.instant('iplb_vrack_private_network_add_edit_field_subnet_label'),
        type: 'text',
        value: undefined,
        required: true,
        minLength: 0,
        maxLength: Infinity,
        disabled: () => this.editing() && this.creationRules.data.status !== 'active',
        helperText: this.$translate.instant('iplb_vrack_private_network_add_edit_field_subnet_helper'),
        inputSize: 2,
      },
      natIp: {
        id: 'natIp',
        label: this.$translate.instant('iplb_vrack_private_network_add_edit_field_nat_ip_label'),
        type: 'text',
        value: undefined,
        required: true,
        minLength: 0,
        maxLength: Infinity,
        disabled: () => this.creationRules.data.status !== 'active',
        helperText: this.$translate.instant('iplb_vrack_private_network_add_edit_field_nat_ip_helper'),
        inputSize: 2,
      },
      farmId: {
        label: this.$translate.instant('iplb_vrack_private_network_add_edit_field_farm_label'),
        value: [],
        disabled: () => false,
      },
    };
  }
}
