import endsWith from 'lodash/endsWith';

export default class CloudProjectBillingRightsAddCtrl {
  /* @ngInject */
  constructor(
    $state,
    $stateParams,
    $translate,
    CucControllerHelper,
    CucCloudMessage,
    OvhApiCloud,
  ) {
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.CucControllerHelper = CucControllerHelper;
    this.CucCloudMessage = CucCloudMessage;
    this.OvhApiCloud = OvhApiCloud;

    this.availableRights = [
      {
        type: 'readOnly',
        label: $translate.instant('cpb_rights_table_rights_value_readOnly'),
      },
      {
        type: 'readWrite',
        label: $translate.instant('cpb_rights_table_rights_value_readWrite'),
      },
    ];

    [this.right] = this.availableRights;
  }

  validateAddRight() {
    return this.OvhApiCloud.Project()
      .Acl()
      .v6()
      .add(
        {
          serviceName: this.$stateParams.projectId,
        },
        {
          accountId: this.constructor.normalizedNic(this.right.contact),
          type: this.right.type,
        },
      )
      .$promise.then(() => {
        this.CucCloudMessage.success(
          this.$translate.instant('cpb_rights_table_rights_add_success'),
        );
      })
      .catch((err) => {
        this.CucCloudMessage.error(
          [
            this.$translate.instant('cpb_rights_add_error'),
            (err.data && err.data.message) || '',
          ].join(' '),
        );
      })
      .finally(() => this.cancel());
  }

  cancel() {
    return this.$state.go('^');
  }

  /**
   * Returns the NIC with "-ovh" appended if it was not the case.
   */
  static normalizedNic(name) {
    // check if the NIC is not an email (it could be the case for US users)
    if (/[@.]+/.test(name)) {
      return name;
    }
    return endsWith(name, '-ovh') ? name : `${name}-ovh`;
  }
}
