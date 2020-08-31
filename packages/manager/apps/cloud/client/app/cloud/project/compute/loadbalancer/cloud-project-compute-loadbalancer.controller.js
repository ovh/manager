import forEach from 'lodash/forEach';
import map from 'lodash/map';
import set from 'lodash/set';

class CloudProjectComputeLoadbalancerCtrl {
  constructor(
    $q,
    $translate,
    $state,
    $stateParams,
    CloudProjectComputeLoadbalancerService,
    OvhApiCloudProjectIplb,
    OvhApiIpLoadBalancing,
    CucCloudMessage,
    OvhApiMe,
    URLS,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.$state = $state;
    this.CloudProjectComputeLoadbalancerService = CloudProjectComputeLoadbalancerService;
    this.OvhApiCloudProjectIplb = OvhApiCloudProjectIplb;
    this.OvhApiIpLoadBalancing = OvhApiIpLoadBalancing;
    this.CucCloudMessage = CucCloudMessage;
    this.OvhApiMe = OvhApiMe;

    this.serviceName = $stateParams.projectId;

    // Datas
    this.table = {
      loadbalancer: [],
    };

    // Order link
    this.urls = URLS;
    this.locale = '';
    // Init locale for order link
    OvhApiMe.v6()
      .get()
      .$promise.then((user) => {
        this.locale = user.ovhSubsidiary.toUpperCase();
      });

    // Loader during Datas requests
    this.loaders = {
      table: {
        loadbalancer: false,
      },
    };
  }

  $onInit() {
    this.getLoadbalancers(true);
  }

  goToLoadbalancerConfigure(serviceName) {
    this.$state.go('iaas.pci-project.compute.loadbalancerConfigure', {
      loadbalancerId: serviceName,
    });
  }

  goToIPLB(serviceName) {
    this.$state.go('iplb.detail.home', {
      serviceName,
    });
  }

  getLoadbalancers(clearCache) {
    if (!this.loaders.table.loadbalancer) {
      this.loaders.table.loadbalancer = true;
      if (clearCache) {
        this.OvhApiCloudProjectIplb.v6().resetQueryCache();
        this.OvhApiIpLoadBalancing.v6().resetQueryCache();
      }
      this.$q
        .all({
          loadbalancers: this.OvhApiIpLoadBalancing.v6()
            .query()
            .$promise.then((response) =>
              this.$q.all(
                map(response, (id) =>
                  this.CloudProjectComputeLoadbalancerService.getLoadbalancer(
                    id,
                  ),
                ),
              ),
            ),
          loadbalancersImportedArray: this.OvhApiCloudProjectIplb.v6()
            .query({
              serviceName: this.serviceName,
            })
            .$promise.then((ids) =>
              this.$q.all(
                map(
                  ids,
                  (id) =>
                    this.OvhApiCloudProjectIplb.v6().get({
                      serviceName: this.serviceName,
                      id,
                    }).$promise,
                ),
              ),
            ),
        })
        .then(({ loadbalancers, loadbalancersImportedArray }) => {
          // Create a map of imported loadbalancers
          const loadBalancerImported = {};
          forEach(loadbalancersImportedArray, (lb) => {
            loadBalancerImported[lb.iplb] = lb;
          });

          // Set openstack importation status
          this.table.loadbalancer = map(loadbalancers, (lb) => {
            if (loadBalancerImported[lb.serviceName]) {
              set(lb, 'openstack', loadBalancerImported[lb.serviceName].status);
            } else {
              set(lb, 'openstack', 'not_imported');
            }
            return lb;
          });
        })
        .catch((err) => {
          this.table.loadbalancer = null;
          this.CucCloudMessage.error(
            [
              this.$translate.instant('cpc_loadbalancer_error'),
              (err.data && err.data.message) || '',
            ].join(' '),
          );
        })
        .finally(() => {
          this.loaders.table.loadbalancer = false;
        });
    }
  }
}

angular
  .module('managerApp')
  .controller(
    'CloudProjectComputeLoadbalancerCtrl',
    CloudProjectComputeLoadbalancerCtrl,
  );
