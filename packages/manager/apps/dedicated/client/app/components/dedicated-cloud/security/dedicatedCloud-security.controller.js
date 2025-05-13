export default class {
  /* @ngInject */
  constructor(
    $rootScope,
    $scope,
    $translate,
    DedicatedCloud,
    OvhApiDedicatedCloud,
  ) {
    this.$rootScope = $rootScope;
    this.$scope = $scope;
    this.$translate = $translate;
    this.DedicatedCloud = DedicatedCloud;
    this.OvhApiDedicatedCloud = OvhApiDedicatedCloud;
  }

  $onInit() {
    this.forceRefresh = false;

    this.policies = {
      model: null,
      info: null,
    };
    this.policySearchSelected = null;

    this.selectedPolicies = [];

    this.loaders = {
      table: false,
      search: false,
      policiesInfo: true,
    };

    this.loadInfo();
  }

  loadInfo() {
    this.loaders.policiesInfo = true;

    this.DedicatedCloud.getSecurityInformations(this.productId).then(
      (informations) => {
        this.policies.info = informations;
        this.loaders.policiesInfo = false;
      },
      (data) => {
        this.loaders.policiesInfo = false;
        this.onError(data);
      },
    );
  }

  loadPaginated({ offset, pageSize }) {
    this.loaders.search = true;
    this.loaders.table = true;

    return this.DedicatedCloud.getSecurityPolicies(
      this.productId,
      pageSize,
      offset - 1,
      this.forceRefresh,
    ).then(
      (paginatedPolicies) => {
        this.forceRefresh = false;
        this.loaders.table = false;
        this.loaders.search = false;
        this.policies.model = paginatedPolicies;
        return {
          data: this.policies.model.list.results,
          meta: {
            totalCount: this.policies.model.fullNetworksList.length,
          },
        };
      },
      (error) => this.onError(error),
    );
  }

  onError(error) {
    this.setMessage(
      `${this.$translate.instant(
        'dedicatedCloud_dashboard_loading_error',
      )} ${error.message || error}}`,
    );
  }

  initSelection() {
    if (
      this.policies &&
      this.policies.model &&
      this.policies.model.list &&
      this.policies.model.list.results
    ) {
      let i = 0;
      let l;
      for (i, l = this.policies.model.list.results.length; i < l; i += 1) {
        if (
          ~this.selectedPolicies.indexOf(this.policies.model.list.results[i].id)
        ) {
          this.policies.model.list.results[i].selected = true;
        } else {
          this.policies.model.list.results[i].selected = false;
        }
      }
    }
  }

  static formatKmsStatus(state) {
    switch (state) {
      case 'creating':
      case 'updating':
      case 'toCreate':
      case 'toUpdate':
        return 'info';
      case 'deleting':
      case 'toDelete':
      case 'unknown':
        return 'warning';
      case 'delivered':
        return 'success';
      default:
        return state;
    }
  }

  globalCheckboxPoliciesStateChange(policies) {
    this.selectedPolicies = policies.map((policy) => policy.id);
    this.initSelection();
  }

  getVMEncryptionKMSList({ offset, pageSize }) {
    return this.DedicatedCloud.getVMEncryptionKMSList(this.productId).then(
      (kmsIds) => ({
        data: kmsIds
          .slice(offset - 1, offset - 1 + pageSize)
          .map((id) => ({ id })),
        meta: {
          totalCount: kmsIds.length,
        },
      }),
    );
  }

  getVMEncryptionKMSDetail(id) {
    return this.DedicatedCloud.getVMEncryptionKMSDetail(this.productId, id);
  }
}
