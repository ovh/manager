import _ from 'lodash';

export default class {
  /* @ngInject */
  constructor(
    $scope,
    $translate,
    OvhApiXdslLinesDslamPort,
    TucToast,
    TucToastError,
  ) {
    this.$scope = $scope;
    this.$translate = $translate;
    this.OvhApiXdslLinesDslamPort = OvhApiXdslLinesDslamPort;
    this.TucToast = TucToast;
    this.TucToastError = TucToastError;
  }

  $onInit() {
    this.loader = true;

    this.OvhApiXdslLinesDslamPort
      .Aapi()
      .getProfiles({
        xdslId: this.serviceName,
        number: this.number,
      },
      (result) => {
        this.loader = false;
        this.profiles = result;
        this.currentProfile = _.find(this.profiles, 'isCurrent');
        this.currentProfileTmp = this.currentProfile;
      }, (err) => {
        this.loader = false;
        return new this.TucToastError(err, 'xdsl_access_dslam_an_error_ocurred');
      });
  }

  changeProfile() {
    if (_.isEmpty(this.serviceName) || !this.currentProfileTmp) {
      this.TucToast.error(this.$translate.instant('xdsl_access_dslam_an_error_ocurred'));
    }

    this.OvhApiXdslLinesDslamPort.v6().changeProfile(
      {
        xdslId: this.serviceName,
        number: this.number,
      },
      { dslamProfileId: this.currentProfileTmp.id },
      (result) => {
        this.currentProfile = this.currentProfileTmp;

        if (result.status === 'todo' || result.status === 'doing') {
          this.$scope.$emit('packXDSLUpdateCurrentTask', { [result.function]: true });
        }

        this.TucToast.success(this.$translate.instant('xdsl_access_profile_doing'));
      }, err => new this.TucToastError(err, 'xdsl_access_dslam_an_error_ocurred'),
    );
  }
}
