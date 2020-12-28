import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';

export default /* @ngInject */ function XdslAccessProfileCtrl(
  $stateParams,
  $scope,
  $translate,
  OvhApiXdslLinesDslamPort,
  TucToast,
  TucToastError,
) {
  const self = this;

  self.loader = true;

  this.changeProfile = function changeProfile() {
    if (isEmpty($stateParams.serviceName) || !self.currentProfileTmp) {
      TucToast.error($translate.instant('xdsl_access_dslam_an_error_ocurred'));
    }

    OvhApiXdslLinesDslamPort.v6().changeProfile(
      {
        xdslId: $stateParams.serviceName,
        number: $stateParams.number,
      },
      { dslamProfileId: self.currentProfileTmp.id },
      (result) => {
        self.currentProfile = self.currentProfileTmp;

        if (result.status === 'todo' || result.status === 'doing') {
          $scope.access.tasks.current[result.function] = true;
        }

        TucToast.success($translate.instant('xdsl_access_profile_doing'));
      },
      (err) => new TucToastError(err, 'xdsl_access_dslam_an_error_ocurred'),
    );
  };

  function init() {
    OvhApiXdslLinesDslamPort.Aapi().getProfiles(
      {
        xdslId: $stateParams.serviceName,
        number: $stateParams.number,
      },
      (result) => {
        self.loader = false;
        self.profiles = result;
        self.currentProfile = find(self.profiles, 'isCurrent');
        self.currentProfileTmp = self.currentProfile;
      },
      (err) => {
        self.loader = false;
        return new TucToastError(err, 'xdsl_access_dslam_an_error_ocurred');
      },
    );
  }
  init();
}
