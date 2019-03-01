angular.module('managerApp').controller('CloudProjectComputeInfrastructurePrivateNetworkDialogCtrl',
  function ($rootScope, $scope, $q, $timeout, $translate, $stateParams,
    CloudProjectComputeInfrastructurePrivateNetworkDialogService, CucRegionService) {
    const self = this;

    self.projectId = $stateParams.projectId;

    self.service = CloudProjectComputeInfrastructurePrivateNetworkDialogService;
    self.regionService = CucRegionService;

    self.form = null;

    self.models = {
      privateNetwork: {
        name: null,
        vlanId: 0,
        regions: [],
      },
      subnet: {
        address: null,
        mask: 24,
        dhcp: true,
      },
      subnets: [],
    };

    self.collections = {
      privateNetworks: [],
    };

    self.states = {
      description: {
        edit: false,
      },
      page: 'menu',
      switch: null,
      vlan: false,
      untagged: false,
    };

    self.userInput = {
      vlanId: 0,
    };

    self.constraints = self.service.getConstraints();

    function init() {
      $q.all([
        self.fetchPrivateNetworks(),
        self.fetchRegions(),
      ]).then(() => {
        self.presetNetwork(self.userInput.vlanId);
      }).finally(() => {
        $rootScope.$broadcast('cuc-highlighted-element.show', 'compute');
      });

      if (!self.service.areUrlsLoading()) {
        self.service.fetchUrls();
      }

      $scope.$on('responsive.switch.created', (event, _switch) => {
        self.states.switch = _switch;
      });
    }

    self.fetchPrivateNetworks = function () {
      if (self.service.arePrivateNetworksLoading()) {
        return $q.when();
      }

      return self.service.fetchPrivateNetworks(self.projectId).then((networks) => {
        self.collections.privateNetworks = networks;
        self.states.untagged = self.hasUntaggedVlan(networks);
        self.models.privateNetwork.vlanId = self.userInput.vlanId;
        self.userInput.vlanId = self.getNextId(networks);

        if (self.states.untagged) {
          self.states.vlan = true;
          self.models.privateNetwork.vlanId = self.userInput.vlanId;
        }

        self.models.privateNetwork.name = $translate.instant('cpcipnd_default_name_template');
      }).catch(() => {
        self.collections.privateNetworks = [];
      });
    };

    self.getGlobalNetwork = function () {
      return [self.models.subnet.address, self.models.subnet.mask].join('/');
    };

    self.getPrivateNetwork = function () {
      return self.models.privateNetwork;
    };

    self.getSubnetTemplate = function () {
      return self.models.subnet;
    };

    self.isDHCPEnabled = function () {
      return self.models.subnet.dhcp;
    };

    self.fetchRegions = function () {
      if (self.service.areRegionsLoading()) {
        return $q.when();
      }

      return self.service.fetchRegions(self.projectId).then((regions) => {
        self.collections.regions = regions;
        self.models.privateNetwork.regions = _.filter(regions, _.isString);
      }).catch(() => {
        self.collections.regions = [];
      });
    };

    self.getRegions = function () {
      return self.collections.regions;
    };

    self.hasRegion = function (region) {
      return _.indexOf(self.collections.regions, region) !== -1;
    };

    self.toggleActiveRegion = function (region) {
      if (!self.hasRegion(region)) {
        return;
      }

      if (self.hasActiveRegion(region)) {
        _.pull(self.models.privateNetwork.regions, region);
      } else {
        self.models.privateNetwork.regions.push(region);
      }

      self.presetNetwork();
    };

    self.hasActiveRegion = function (region) {
      return _.indexOf(self.models.privateNetwork.regions, region) !== -1;
    };

    self.getActiveRegions = function () {
      return self.models.privateNetwork.regions;
    };

    self.isRegionTogglingDisabled = function (region) {
      return self.models.privateNetwork.regions.length <= 1 && self.hasActiveRegion(region);
    };

    self.getSubnetsDescription = function () {
      return _.filter(this.models.privateNetwork.regions, _.isString).join(', ');
    };

    self.toggleEditDescription = function () {
      self.states.description.edit = !self.states.description.edit;
    };

    self.hasErrors = function (ngModel) {
      if (!ngModel) {
        return false;
      }

      return ngModel.$invalid;
    };

    self.getGroupClasses = function (ngModel) {
      if (!ngModel) {
        return {};
      }

      return {
        'has-success': ngModel.$touched && ngModel.$valid,
        'has-error': self.hasErrors(ngModel),
      };
    };

    self.getActivePage = function () {
      return self.states.page;
    };

    self.getActivePageIndex = function () {
      switch (self.states.page) {
        case 'common':
        case 'subnets': return 1;
        default: return 0;
      }
    };

    self.isActivePage = function (page) {
      if (!self.states.page) {
        return false;
      }

      return self.states.page === page;
    };

    self.setActivePage = function (page) {
      self.states.page = page;
    };

    self.isSwitchMode = function () {
      if (!self.states.switch) {
        return false;
      }

      return self.states.switch.getDisplayMode() === 'switch';
    };

    self.submit = function () {
      if (!self.form.$valid || self.service.isSavePending()) {
        return;
      }

      const options = {
        projectId: self.projectId,
        privateNetwork: self.models.privateNetwork,
        subnets: self.models.subnets,
        isDHCPEnabled: self.isDHCPEnabled(),
        globalNetwork: self.getGlobalNetwork(),
      };

      $rootScope.$emit('private-networks:create', options);
    };

    self.getApiUrl = function () {
      return self.service.getUrls().api || '';
    };

    function resetSubnetAddress() {
      self.models.subnet.address = '192.168.0.0';
    }

    function resetIpRanges() {
      const regions = _.sortBy(self.getActiveRegions(), region => region);
      const split = CloudProjectComputeInfrastructurePrivateNetworkDialogService.splitSubnetIpAddresses('255.255.255.0', self.models.subnet.address, regions.length);

      if (split.isValid) {
        const subnets = _.zipWith(regions, split.ipBlocks, (region, ipBlock) => {
          _.set(ipBlock, 'region', region);
          // API needs noGateway but it is more logical to match with checkbox value first
          _.set(ipBlock, 'gateway', false);
          _.set(ipBlock, 'noGateway', !ipBlock.gateway);
          return ipBlock;
        });
        self.models.subnets = _.zipObject(regions, subnets);
      } else {
        self.models.subnets = [];
      }
    }

    self.presetNetwork = function (id) {
      if (id) {
        resetSubnetAddress(id);
      }
      resetIpRanges();
    };


    self.hasPendingLoaders = function () {
      return self.service.areRegionsLoading()
        || self.service.arePrivateNetworksLoading()
        || self.service.isSavePending();
    };

    self.hasUntaggedVlan = function (networks) {
      return self.findVlanWithID(networks, 0);
    };

    self.getNextId = function (networks) {
      for (let i = self.constraints.vlanId.min; i < self.constraints.vlanId.max; i += 1) {
        const vlanExists = self.findVlanWithID(networks, i);
        if (!vlanExists) {
          return i;
        }
      }
      return false;
    };

    self.findVlanWithID = function (networks, id) {
      return _.findWhere(networks, { vlanId: id });
    };

    self.close = function () {
      $rootScope.$emit('private-network-dialog:hide');
    };

    self.changeSubnets = function (region) {
      self.models.subnets[region].noGateway = !self.models.subnets[region].gateway;
    };

    $scope.$watch(() => self.states.vlan, (newValue, oldValue) => {
      if (oldValue !== newValue) {
        if (newValue === true) {
          self.models.privateNetwork.vlanId = self.userInput.vlanId;
        } else {
          self.userInput.vlanId = self.models.privateNetwork.vlanId;
          self.models.privateNetwork.vlanId = 0;
        }
      }
    });

    $scope.$watch(() => self.models.privateNetwork.vlanId, (newValue, oldValue) => {
      if (oldValue !== newValue) {
        self.presetNetwork(newValue);
      }
    });

    $scope.$watch('self.models.privateNetwork.vlanId', (newValue, oldValue) => {
      if (oldValue !== newValue) {
        self.presetNetwork(newValue);
      }
    });

    init();
  });
