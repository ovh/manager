import find from 'lodash/find';
import map from 'lodash/map';

export default class VrackMoveDialogCtrl {
  /* @ngInject */
  constructor(
    $q,
    $scope,
    $translate,
    OvhApiVrack,
    OvhApiVrackDedicatedCloudDatacenter,
  ) {
    this.$q = $q;
    this.$scope = $scope;
    this.$translate = $translate;
    this.OvhApiVrack = OvhApiVrack;
    this.OvhApiVrackDedicatedCloudDatacenter = OvhApiVrackDedicatedCloudDatacenter;
  }

  $onInit() {
    this.form = null;
    this.models = {
      vrack: null,
    };

    this.collections = {
      allowedVracks: [],
      vracks: [],
    };

    this.loaders = {
      allowedVrack: false,
      vrack: false,
      move: false,
    };
    this.error = null;

    this.fetchAllowedVracks();
  }

  fetchAllowedVracks() {
    if (this.loaders.allowedVrack) {
      return this.$q.when();
    }

    this.loaders.allowedVrack = true;

    return this.OvhApiVrackDedicatedCloudDatacenter.v6()
      .allowedVrack({
        serviceName: this.service.vrack,
        datacenter: this.service.id,
      })
      .$promise.then((allowedVracks) => {
        if (!allowedVracks.length) {
          return this.$q.when();
        }
        return this.fetchVracks().then(() => {
          this.collections.allowedVracks = map(
            allowedVracks,
            (allowedVrack) => {
              const vrack = find(this.getVracks(), { id: allowedVrack }) || {
                id: allowedVrack,
              };
              return {
                ...vrack,
                name: vrack.name || allowedVrack,
              };
            },
          );
          return this.collections.allowedVracks;
        });
      })
      .catch(() => {
        this.collections.allowedVracks = [];
      })
      .finally(() => {
        this.loaders.allowedVrack = false;
      });
  }

  fetchVracks() {
    if (this.loaders.vracks) {
      return this.$q.when();
    }

    this.loaders.vracks = true;

    return this.OvhApiVrack.Aapi()
      .query()
      .$promise.then((vracks) => {
        this.collections.vracks = vracks;
      })
      .catch(() => {
        this.collections.vracks = [];
      })
      .finally(() => {
        this.loaders.vracks = false;
      });
  }

  getVracks() {
    return this.collections.vracks;
  }

  submit() {
    if (!this.form.$valid || this.loaders.move) {
      return this.$q.when();
    }

    this.loaders.move = true;
    this.error = null;

    return this.OvhApiVrackDedicatedCloudDatacenter.v6()
      .move(
        {
          serviceName: this.service.vrack,
          datacenter: this.service.id,
        },
        {
          targetServiceName: this.models.vrack.id,
        },
      )
      .$promise.then(() => {
        this.$scope.$emit('vrack:refresh-data');
        this.goBack(true);
      })
      .catch(() => {
        this.error = this.$translate.instant('vrack_move_dialog_request_error');
      })
      .finally(() => {
        this.loaders.move = false;
      });
  }

  hasPendingRequests() {
    return this.loaders.move;
  }
}
