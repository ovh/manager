import { NETWORK_STATUS } from './dedicatedCloud-security.constants';

export default class {
  /* @ngInject */
  constructor($translate, DedicatedCloud) {
    this.$translate = $translate;
    this.DedicatedCloud = DedicatedCloud;
    this.NETWORK_STATUS = NETWORK_STATUS;
  }

  $onInit() {
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
      offset,
      true,
    )
      .then((results) => {
        this.policies.model = results?.data || [];
        return results;
      })
      .catch(this.onError)
      .finally(() => {
        this.loaders.table = false;
        this.loaders.search = false;
      });
  }

  onError(error) {
    this.setMessage(
      `${this.$translate.instant(
        'dedicatedCloud_dashboard_loading_error',
      )} ${error.message || error}}`,
    );
  }

  initSelection() {
    this.selectedPolicies.forEach((id) => {
      const policy = this.policies.model.find(
        ({ networkAccessId }) => networkAccessId === id,
      );
      if (policy) {
        policy.selected = true;
      }
    });
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
    this.selectedPolicies = policies.map((policy) => policy.networkAccessId);
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
