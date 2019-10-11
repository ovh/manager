angular.module('App').controller('DedicatedCloudOperationsCtrl', function ($q, $scope, $state, $stateParams, $translate, $window, BillingOrders, Alerter, DedicatedCloud, ouiDatagridService, $uibModal) {
  const self = this;

  function init() {
    self.loading = true;
    return DedicatedCloud.getModels().then((data) => {
      self.stateEnum = data.models['dedicatedCloud.TaskStateEnum'].enum;
      self.progressionFilter = null;
      self.progressionFilterList = _.map(self.stateEnum, state => ({
        value: state,
        label: $translate.instant(`dedicatedCloud_OPERATIONS_state_${state}`),
      }));
      $scope.$watch('$ctrl.progressionFilter', (newValue, oldValue) => {
        if (newValue !== oldValue) {
          ouiDatagridService.refresh('operationsDatagrid', true);
        }
      });
    }).catch((err) => {
      Alerter.alertFromSWS($translate.instant('dedicatedCloud_OPERATIONS_error'), err);
    }).finally(() => {
      self.loading = false;
    });
  }

  self.loadOperations = ({ offset, pageSize }) => {
    const opts = {};
    if (self.progressionFilter) {
      opts.params = {
        state: self.progressionFilter,
      };
    }
    return DedicatedCloud.getOperations(
      $stateParams.productId,
      opts,
    ).then((result) => {
      result.reverse();
      return {
        data: result.slice(offset - 1, offset - 1 + pageSize).map(id => ({ id })),
        meta: {
          totalCount: result.length,
        },
      };
    });
  };

  function setRelatedServices(operation) {
    const baseTrad = 'dedicatedCloud_OPERATIONS_related_';
    _.set(operation, 'relatedServices', []);

    // related service that could not be links
    _.each(['networkAccessId', 'parentTaskId'], (field) => {
      const value = operation[field];
      if (!_.isNull(value)) {
        operation.relatedServices.push({
          label: $translate.instant(`${baseTrad}${field}`, {
            t0: value,
          }),
          field,
        });
      }
    });

    // related service where we can generate an url to link it.
    _.each(['datacenterId', 'hostId', 'filerId'], (field) => {
      const value = operation[field];
      if (value) {
        let action = angular.noop;

        switch (field) {
          case 'datacenterId':
            action = () => $state.go('app.dedicatedClouds.datacenter', {
              productId: $stateParams.productId,
              datacenterId: operation.datacenterId,
            });
            break;
          case 'hostId':
            action = () => $state.go('app.dedicatedClouds.datacenter.hosts', {
              productId: $stateParams.productId,
              datacenterId: operation.datacenterId,
            });
            break;
          case 'filerId':
            action = () => $state.go('app.dedicatedClouds.datacenter.datastores', {
              productId: $stateParams.productId,
              datacenterId: operation.datacenterId,
            });
            break;
          default:
            break;
        }

        operation.relatedServices.push({
          label: $translate.instant(`${baseTrad}${field}`, {
            t0: value,
          }),
          action,
          field,
        });
      }
    });

    _.each(['userId'], (field) => {
      if (operation.userId) {
        operation.relatedServices.push({
          label: $translate.instant(`${baseTrad}userId`, {
            t0: operation.userId,
          }),
          action: () => {
            $state.go('app.dedicatedClouds.users');
          },
          field,
        });
      }
    });

    // related service that are a callback for onClick because we cannot do a direct link to them
    // order need to fetch the order to get it's url, so we don't want to do it for all order
    // we fetch it on request
    _.each(['orderId'], (field) => {
      if (operation.orderId) {
        const params = _.pick(operation, ['datacenterId', 'serviceName']);
        params[field] = operation.orderId;
        operation.relatedServices.push({
          label: $translate.instant(`${baseTrad}${field}`, {
            t0: operation.orderId,
          }),
          action: () => BillingOrders.getOrder(operation.orderId).then((order) => {
            $window.open(order.url);
          }).catch((err) => {
            Alerter.alertFromSWS($translate.instant('dedicatedCloud_OPERATIONS_error'), err);
          }),
          field,
        });
      }
    });

    return operation;
  }

  function setOperationDescription(operation) {
    if (operation.description === '') {
      return DedicatedCloud
        .getOperationDescription($stateParams.productId, { name: operation.name })
        .then((robot) => {
          _.set(operation, 'description', robot.description);
          return operation;
        });
    }
    return $q.when(operation);
  }

  self.loadOperation = item => DedicatedCloud
    .getOperation($stateParams.productId, {
      taskId: item.id,
    })
    .then((op) => {
      const friendlyNameBy = op.createdBy ? $translate.instant(`dedicatedCloud_OPERATIONS_createdby_${op.createdBy.replace(/-/g, '_')}`) : $translate.instant('common_unavailable_information');
      const friendlyNameFrom = op.createdFrom ? $translate.instant(`dedicatedCloud_OPERATIONS_createdfrom_${op.createdFrom.replace(/-/g, '_')}`) : $translate.instant('common_unavailable_information');
      _.set(op, 'createdBy', friendlyNameBy.startsWith('dedicatedCloud_OPERATIONS_createdby_') ? op.createdBy : friendlyNameBy);
      _.set(op, 'createdFrom', friendlyNameFrom.startsWith('dedicatedCloud_OPERATIONS_createdfrom_') ? op.createdFrom : friendlyNameFrom);
      _.set(op, 'isDone', _.includes(['canceled', 'done'], op.state));
      return op;
    })
    .then(setOperationDescription)
    .then(setRelatedServices)
    .then(res => res);

  self.onExecutionDateActionClick = ($row) => {
    const executionDateEditModal = $uibModal.open({
      templateUrl: 'dedicatedCloud/operation/executionDateEdit/dedicatedCloud-operation-executionDateEdit.html',
      controller: 'DedicatedCloudOperationExecutionDateEditCtrl',
      controllerAs: '$ctrl',
      resolve: {
        operationToEdit: () => $row,
      },
    });

    return executionDateEditModal.result.then((error) => {
      if (!error) {
        Alerter.success($translate.instant('dedicatedCloud_OPERATIONS_success'));
        ouiDatagridService.refresh('operationsDatagrid', true);
      } else {
        Alerter.alertFromSWS($translate.instant('dedicatedCloud_OPERATIONS_error'), error);
      }
    });
  };

  init();
});
