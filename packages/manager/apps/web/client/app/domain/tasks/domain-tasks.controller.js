import clone from 'lodash/clone';
import map from 'lodash/map';

angular.module('controllers').controller(
  'controllers.Domain.Tasks',
  class DomainTasksCtrl {
    constructor($scope, $q, $state, $stateParams, Domain) {
      this.$scope = $scope;
      this.$q = $q;
      this.$state = $state;
      this.$stateParams = $stateParams;
      this.Domain = Domain;
    }

    $onInit() {
      this.getTasks();
    }

    getTasks() {
      return this.$q
        .all({
          zoneDnsTasks: this.Domain.getZoneDnsTasks(
            this.$stateParams.productId,
          ).catch(() => []),
          tasks: this.Domain.getTasks(
            this.$stateParams.productId,
          ).catch(() => []),
        })
        .then(({ zoneDnsTasks, tasks }) => {
          this.tasks = this.constructor
            .getTaskStruct(zoneDnsTasks, true)
            .concat(this.constructor.getTaskStruct(tasks, false));
        });
    }

    static getTaskStruct(tasks, isZone) {
      return map(tasks, (task) => ({ id: task, zone: isZone }));
    }

    transformItem(item) {
      if (item.zone) {
        return this.Domain.getZoneDnsTask(
          this.$stateParams.productId,
          item.id,
        ).then((originalResult) => {
          const result = clone(originalResult);

          result.status = result.status.toUpperCase();
          return result;
        });
      }
      return this.Domain.getTask(this.$stateParams.productId, item.id);
    }
  },
);
