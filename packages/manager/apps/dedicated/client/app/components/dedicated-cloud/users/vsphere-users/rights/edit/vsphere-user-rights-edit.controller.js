export default class {
  /* @ngInject */
  constructor($q, $translate, DedicatedCloud) {
    this.$q = $q;
    this.$translate = $translate;
    this.DedicatedCloud = DedicatedCloud;
  }

  $onInit() {
    this.loading = {
      init: true,
      save: false,
    };
    this.right = null;
    this.datacenter = null;
    this.enums = null;

    return this.$q
      .all({
        right: this.DedicatedCloud.getUserRight(
          this.productId,
          this.user.userId,
          this.rightId,
        ),
        models: this.DedicatedCloud.getModels(),
      })
      .then((response) => {
        this.right = response.right;
        this.enums = {
          right: response.models.models['dedicatedCloud.right.RightEnum'].enum,
          networkRole:
            response.models.models['dedicatedCloud.right.NetworkRoleEnum'].enum,
          vmNetworkRole:
            response.models.models['dedicatedCloud.right.VmNetworkRoleEnum']
              .enum,
        };

        return this.DedicatedCloud.getDatacenterInfoProxy(
          this.productId,
          this.right.datacenterId,
        ).then((datacenter) => {
          this.datacenter = datacenter;
        });
      })
      .catch((error) => {
        this.goBack(
          `${this.$translate.instant(
            'dedicatedCloud_USER_right_get_fail',
          )} ${error.message || error}`,
          'danger',
        );
      })
      .finally(() => {
        this.loading.init = false;
      });
  }

  setUserRight() {
    this.loading.save = true;

    return this.DedicatedCloud.setUserRights(
      this.productId,
      this.user.userId,
      this.right,
    )
      .then(() => {
        this.goBack(
          this.$translate.instant('dedicatedCloud_USER_right_set_success', {
            t0: this.user.name,
            t1: this.datacenter.name,
          }),
        );
      })
      .catch((err) => {
        this.goBack(
          `${this.$translate.instant('dedicatedCloud_USER_right_set_fail', {
            t0: this.user.name,
            t1: this.datacenter.name,
          })} ${err.message || err}`,
          'danger',
        );
      });
  }
}
