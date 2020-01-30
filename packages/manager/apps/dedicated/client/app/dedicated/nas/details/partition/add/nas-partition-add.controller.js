angular.module('App').controller(
  'NasPartitionAddCtrl',
  class NasPartitionAddCtrl {
    constructor($rootScope, $scope, $stateParams, Alerter, Nas) {
      this.$rootScope = $rootScope;
      this.$scope = $scope;
      this.$stateParams = $stateParams;
      this.Alerter = Alerter;
      this.Nas = Nas;
    }

    $onInit() {
      this.alerterId = 'NasAlert';

      this.$scope.currentNasPartition = this.$scope.currentActionData;

      this.$scope.newPartition = {
        name: null,
        sizeP: null,
        minSizeP: 10,
        protocol: null,
      };

      this.$scope.addPartition = this.addPartition.bind(this);

      return this.Nas.getConstant(this.$stateParams.nasId)
        .then((constants) => {
          this.$scope.protocols = constants;
        })
        .catch(() => {
          this.$scope.resetAction();
          this.Alerter.error(
            this.$translate.instant('nas_partitions_action_add_init'),
            this.alerterId,
          );
        });
    }

    checkSize() {
      if (this.$scope.newPartition.sizeP) {
        this.$scope.newPartition.sizeP = parseInt(
          this.$scope.newPartition.sizeP.toString().replace('.', ''),
          10,
        );
      }
    }

    /**
     * Add partition.
     * @return {Promise}
     */
    addPartition() {
      this.$scope.resetAction();
      return this.Nas.addPartition(
        this.$stateParams.nasId,
        this.$scope.newPartition.name,
        this.$scope.newPartition.protocol,
        this.$scope.newPartition.sizeP,
      )
        .then((task) => {
          this.$rootScope.$broadcast('nas_launch_task', task);
          this.Alerter.success(
            this.$translate.instant('nas_partitions_action_add_success', {
              t0: this.$scope.newPartition.name,
            }),
            this.alerterId,
          );
        })
        .catch((err) =>
          this.Alerter.alertFromSWS(
            this.$translate.instant('nas_partitions_action_add_failure', {
              t0: this.$scope.newPartition.name,
            }),
            err,
            this.alerterId,
          ),
        );
    }
  },
);
