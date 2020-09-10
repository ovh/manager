import forEach from 'lodash/forEach';
import includes from 'lodash/includes';
import isNull from 'lodash/isNull';
import map from 'lodash/map';
import pick from 'lodash/pick';
import set from 'lodash/set';

export default class {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    $window,
    BillingOrders,
    DedicatedCloud,
    ouiDatagridService,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.$window = $window;
    this.BillingOrders = BillingOrders;
    this.DedicatedCloud = DedicatedCloud;
    this.ouiDatagridService = ouiDatagridService;
  }

  $onInit() {
    this.loading = true;
    return this.DedicatedCloud.getModels()
      .then((data) => {
        this.stateEnum = data.models['dedicatedCloud.TaskStateEnum'].enum;
        this.progressionFilter = null;
        this.progressionFilterList = map(this.stateEnum, (state) => ({
          value: state,
          label: this.$translate.instant(
            `dedicatedCloud_OPERATIONS_state_${state}`,
          ),
        }));
      })
      .catch((err) => {
        this.setMessage(
          `${this.$translate.instant(
            'dedicatedCloud_OPERATIONS_error',
          )} ${err.message || err}`,
        );
      })
      .finally(() => {
        this.loading = false;
      });
  }

  progressionFilterChanged() {
    this.ouiDatagridService.refresh('operationsDatagrid', true);
  }

  loadOperations({ offset, pageSize }) {
    const opts = {};
    if (this.progressionFilter) {
      opts.params = {
        state: this.progressionFilter,
      };
    }
    return this.DedicatedCloud.getOperations(this.productId, opts).then(
      (result) => {
        result.reverse();
        return {
          data: result
            .slice(offset - 1, offset - 1 + pageSize)
            .map((id) => ({ id })),
          meta: {
            totalCount: result.length,
          },
        };
      },
    );
  }

  setRelatedServices(operation) {
    const baseTrad = 'dedicatedCloud_OPERATIONS_related_';
    set(operation, 'relatedServices', []);

    // related service that could not be links
    forEach(['networkAccessId', 'parentTaskId'], (field) => {
      const value = operation[field];
      if (!isNull(value)) {
        operation.relatedServices.push({
          label: this.$translate.instant(`${baseTrad}${field}`, {
            t0: value,
          }),
          field,
        });
      }
    });

    // related service where we can generate an url to link it.
    forEach(['datacenterId', 'hostId', 'filerId'], (field) => {
      const value = operation[field];
      if (value) {
        let action = angular.noop;

        switch (field) {
          case 'datacenterId':
            action = () => this.goToDatacenter(operation.datacenterId);
            break;
          case 'hostId':
            action = () => this.goToHosts(operation.datacenterId);
            break;
          case 'filerId':
            action = () => this.goToDatastores(operation.datacenterId);
            break;
          default:
            break;
        }

        operation.relatedServices.push({
          label: this.$translate.instant(`${baseTrad}${field}`, {
            t0: value,
          }),
          action,
          field,
        });
      }
    });

    forEach(['userId'], (field) => {
      if (operation.userId) {
        operation.relatedServices.push({
          label: this.$translate.instant(`${baseTrad}userId`, {
            t0: operation.userId,
          }),
          action: () => {
            this.goToUsers();
          },
          field,
        });
      }
    });

    // related service that are a callback for onClick because we cannot do a direct link to them
    // order need to fetch the order to get it's url, so we don't want to do it for all order
    // we fetch it on request
    forEach(['orderId'], (field) => {
      if (operation.orderId) {
        const params = pick(operation, ['datacenterId', 'serviceName']);
        params[field] = operation.orderId;
        operation.relatedServices.push({
          label: this.$translate.instant(`${baseTrad}${field}`, {
            t0: operation.orderId,
          }),
          action: () =>
            this.BillingOrders.getOrder(operation.orderId)
              .then((order) => {
                this.$window.open(order.url);
              })
              .catch((err) => {
                this.setMessage(
                  `${this.$translate.instant(
                    'dedicatedCloud_OPERATIONS_error',
                  )} ${err.message || err}`,
                );
              }),
          field,
        });
      }
    });

    return operation;
  }

  setOperationDescription(operation) {
    if (operation.description === '') {
      return this.DedicatedCloud.getOperationDescription(this.productId, {
        name: operation.name,
      }).then((robot) => {
        set(operation, 'description', robot.description);
        return operation;
      });
    }
    return this.$q.when(operation);
  }

  loadOperation(item) {
    return this.DedicatedCloud.getOperation(this.productId, {
      taskId: item.id,
    })
      .then((op) => {
        const friendlyNameBy = op.createdBy
          ? this.$translate.instant(
              `dedicatedCloud_OPERATIONS_createdby_${op.createdBy.replace(
                /-/g,
                '_',
              )}`,
            )
          : this.$translate.instant('common_unavailable_information');
        const friendlyNameFrom = op.createdFrom
          ? this.$translate.instant(
              `dedicatedCloud_OPERATIONS_createdfrom_${op.createdFrom.replace(
                /-/g,
                '_',
              )}`,
            )
          : this.$translate.instant('common_unavailable_information');
        set(
          op,
          'createdBy',
          friendlyNameBy.startsWith('dedicatedCloud_OPERATIONS_createdby_')
            ? op.createdBy
            : friendlyNameBy,
        );
        set(
          op,
          'createdFrom',
          friendlyNameFrom.startsWith('dedicatedCloud_OPERATIONS_createdfrom_')
            ? op.createdFrom
            : friendlyNameFrom,
        );
        set(op, 'isDone', includes(['canceled', 'done'], op.state));
        return op;
      })
      .then((operation) => this.setOperationDescription(operation))
      .then((operation) => this.setRelatedServices(operation));
  }
}
