import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';

export default /* @ngInject */ function VrackMoveDialogCtrl(
  $scope,
  $q,
  $translate,
  $uibModalInstance,
  Toast,
  OvhApiVrack,
  OvhApiVrackDedicatedCloudDatacenter,
) {
  const self = this;

  self.form = null;

  self.service = $scope.$resolve.service;

  self.models = {
    vrack: null,
  };

  self.collections = {
    allowedVracks: [],
    vracks: [],
  };

  self.loaders = {
    allowedVrack: false,
    vrack: false,
    move: false,
  };

  function init() {
    self.fetchAllowedVracks();
  }

  self.fetchAllowedVracks = function fetchAllowedVracks() {
    if (self.loaders.allowedVrack) {
      return $q.when();
    }

    self.loaders.allowedVrack = true;

    return OvhApiVrackDedicatedCloudDatacenter.v6()
      .allowedVrack({
        serviceName: self.service.vrack,
        datacenter: self.service.id,
      })
      .$promise.then((allowedVracks) => {
        if (!allowedVracks.length) {
          return $q.when();
        }
        self.collections.allowedVracks = allowedVracks;
        return self.fetchVracks();
      })
      .catch(() => {
        self.collections.allowedVracks = [];
      })
      .finally(() => {
        self.loaders.allowedVrack = false;
      });
  };

  self.fetchVracks = function fetchVracks() {
    if (self.loaders.vracks) {
      return;
    }

    self.loaders.vracks = true;

    OvhApiVrack.Aapi()
      .query()
      .$promise.then((vracks) => {
        self.collections.vracks = vracks;
      })
      .catch(() => {
        self.collections.vracks = [];
      })
      .finally(() => {
        self.loaders.vracks = false;
      });
  };

  self.getDisplayName = function getDisplayName(vrackId) {
    const vrack = find(self.getVracks(), { id: vrackId });

    if (vrack && !isEmpty(vrack.name)) {
      return vrack.name;
    }

    return vrackId;
  };

  self.dismiss = function dismiss() {
    $uibModalInstance.dismiss();
  };

  self.getAllowedVracks = function getAllowedVracks() {
    return self.collections.allowedVracks;
  };

  self.getVracks = function getVracks() {
    return self.collections.vracks;
  };

  self.submit = function submit() {
    if (!self.form.$valid || self.loaders.move) {
      return $q.when();
    }

    self.loaders.move = true;

    return OvhApiVrackDedicatedCloudDatacenter.v6()
      .move(
        {
          serviceName: self.service.vrack,
          datacenter: self.service.id,
        },
        {
          targetServiceName: self.models.vrack,
        },
      )
      .$promise.then((task) => {
        $scope.$emit('vrack:refresh-data');
        $uibModalInstance.close({ task });
      })
      .catch(() => {
        Toast.error($translate.instant('vrack_move_dialog_request_error'));
      })
      .finally(() => {
        self.loaders.move = false;
      });
  };

  self.hasPendingRequests = function hasPendingRequests() {
    return self.loaders.move;
  };

  init();
}
