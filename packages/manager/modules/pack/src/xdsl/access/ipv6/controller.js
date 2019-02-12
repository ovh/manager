import _ from 'lodash';

export default class {
  /* @ngInject */
  constructor(
    $scope,
    $translate,
    OvhApiXdslIps,
    TucToast,
    TucToastError,
  ) {
    this.$scope = $scope;
    this.$translate = $translate;
    this.OvhApiXdslIps = OvhApiXdslIps;
    this.TucToast = TucToast;
    this.TucToastError = TucToastError;
  }

  $onInit() {
    // if task in progress -> it means that ipv6Enabled is going to change
    if (this.routingIpv6) {
      // emit updateIpV6ENABLED
      // this.$scope.access.xdsl.ipv6Enabled = !this.$scope.access.xdsl.ipv6Enabled;
      this.$scope.$emit('packXDSLUpdateIpV6Enabled', !this.ipv6Enabled);
    }

    this.$scope.message = "<h3>{{ 'xdsl_access_ipv6_status' | translate }}</h3>{{ access.xdsl.ipv6Enabled ? 'xdsl_access_ipv6_really_on' : 'xdsl_access_ipv6_really_off' | translate }} "
    + "<div class='text-warning'>{{ 'xdsl_access_ipv6_warning' | translate }}</div> ";
    if (this.isZyxel) {
      this.$scope.message += "<div class='text-warning'>{{ 'xdsl_access_ipv6_zyxel_warning' | translate }}</div>";
    }
  }

  submitIp() {
    if (_.isEmpty(this.serviceName)) {
      this.TucToast.error(this.$translate.instant('xdsl_access_ipv6_an_error_ocurred'));
    }

    this.OvhApiXdslIps
      .v6()
      .setIpv6(
        { xdslId: this.serviceName },
        { enabled: this.ipv6Enabled },
        (result) => {
          if (result.status === 'todo' || result.status === 'doing') {
            // this.$scope.access.tasks.current[result.function] = true;
            this.$scope.$emit('packXDSLUpdateCurrentTask', { [result.function]: true });
          }
          console.log(this.ipv6Enabled);
          if (this.ipv6Enabled) {
            this.TucToast.success(this.$translate.instant('xdsl_access_ipv6_success_validation_on'));
          } else {
            this.TucToast.success(this.$translate.instant('xdsl_access_ipv6_success_validation_off'));
          }
        },
        (err) => {
          this.$scope.$emit('packXDSLUpdateIpV6Enabled', !this.ipv6Enabled);

          // this.$scope.access.xdsl.ipv6Enabled = !this.ipv6Enabled;
          return new this.TucToastError(err, 'xdsl_access_ipv6_an_error_ocurred');
        },
      );
  }

  undo() {
    this.$scope.access.xdsl.ipv6Enabled = !this.$scope.access.xdsl.ipv6Enabled;
  }
}
