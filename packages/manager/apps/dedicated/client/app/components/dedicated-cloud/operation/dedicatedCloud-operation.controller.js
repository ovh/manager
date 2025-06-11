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
    DedicatedCloud,
    ouiDatagridService,
    OvhHttp,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.$window = $window;
    this.DedicatedCloud = DedicatedCloud;
    this.ouiDatagridService = ouiDatagridService;
    this.OvhHttp = OvhHttp;
  }

  $onInit() {
    this.loading = true;
    return this.DedicatedCloud.getModels()
      .then((data) => {
        this.stateEnum = data.models['dedicatedCloud.TaskStateEnum'].enum;
        this.progressionFilter = 'doing';
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

  refreshOperations() {
    this.ouiDatagridService.refresh('operationsDatagrid', true);
  }

  progressionFilterChanged() {
    this.ouiDatagridService.refresh('operationsDatagrid', true);
  }

  loadOperations({ offset, pageSize, sort }) {
    const isCacheDisabled =
      !!this.progressionFilter &&
      !['done', 'canceled'].includes(this.progressionFilter);

    const paginationParams = {
      offset,
      pageSize,
      sort: sort.property,
      sortOrder: sort.dir === 1 ? 'ASC' : 'DESC',
      defaultFilterColumn: 'executionDate',
      isCacheDisabled,
    };
    // limitation to 6 months in case of too much data
    const executionDate = new Date();
    executionDate.setMonth(executionDate.getMonth() - 6);
    const urlParams = {
      state: this.progressionFilter,
      executionDate: executionDate.toISOString(),
    };
    return this.DedicatedCloud.getOperations(
      this.productId,
      paginationParams,
      urlParams,
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
            this.OvhHttp.get('/me/order/{id}', {
              rootPath: 'apiv6',
              urlParams: {
                id: operation.orderId,
              },
            })
              .then((order) => {
                this.$window.open(order.url);
              })
              .catch((err) => {
                this.setMessage(
                  `${this.$translate.instant(
                    'dedicatedCloud_OPERATIONS_error',
                  )} ${err.message || err}`,
                  'danger',
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
      })
        .then((robot) => {
          set(operation, 'description', robot.description);
          return operation;
        })
        .catch(() => operation);
    }
    return this.$q.when(operation);
  }

  loadOperationAdditionalData(op) {
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

    return this.setOperationDescription(op).then((operation) =>
      this.setRelatedServices(operation),
    );
  }
}
