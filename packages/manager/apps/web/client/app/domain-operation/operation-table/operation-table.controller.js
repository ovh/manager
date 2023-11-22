import set from 'lodash/set';
import isEmpty from 'lodash/isEmpty';

export default class OperationTableController {
  /* @ngInject */
  constructor($scope, $timeout, Alerter, domainOperationService) {
    this.$scope = $scope;
    this.$timeout = $timeout;
    this.Alerter = Alerter;
    this.Operation = domainOperationService;
  }

  $onInit() {
    this.stepPath = '';

    this.$scope.alerts = { dashboard: 'domains.operations.alerts' };
    this.$scope.resetAction = () => this.$scope.setAction(false);
    this.$scope.setAction = (action, data) => {
      this.$scope.currentAction = action;
      this.$scope.currentActionData = data;

      if (action) {
        this.stepPath = `${this.$scope.currentAction}.html`;
        $('#currentAction').modal({
          keyboard: true,
          backdrop: 'static',
        });
      } else {
        $('#currentAction').modal('hide');
        this.$scope.currentActionData = null;
        this.$timeout(() => {
          this.stepPath = '';
        }, 300);
      }
    };

    this.$scope.$on('domains.operations.relaunched', this.getOperationIds);
    this.$scope.$on('$locationChangeStart', () => {
      this.$scope.resetAction();
    });

    this.getOperationIds();
  }

  transformItem(id) {
    return this.getOperation(id);
  }

  static capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  resetSearch() {
    this.filters[this.constructor.normalizeName(this.type)] = '';
    this.getOperationIds();
  }

  getOperation(args) {
    return this.Operation[
      `get${this.constructor.capitalizeFirstLetter(this.type)}Operation`
    ](args);
  }

  getOperationIds() {
    return this[
      `get${this.constructor.capitalizeFirstLetter(this.type)}OperationIds`
    ]();
  }

  getDomainOperationIds() {
    this.loading.init = true;
    this.operationIds = null;

    return this.Operation.getDomainOperations({
      function: this.filters.nicOperation || undefined,
      status: this.filters.operationStatus || undefined,
      domain: `%${this.filters[this.constructor.normalizeName(this.type)] ||
        ''}%`,
    })
      .then((operationIds) => {
        this.operationIds = operationIds;
      })
      .catch((err) => {
        set(err, 'type', err.type || 'ERROR');
        this.Alerter.alertFromSWS(
          this.$translate.instant('domains_operations_error'),
          err,
          this.$scope.alerts.main,
        );
      })
      .finally(() => {
        if (isEmpty(this.operationIds)) {
          this.loading.init = false;
        }
      });
  }

  getDnsOperationIds() {
    this.loading.init = true;
    this.operationIds = null;

    return this.Operation.getDnsOperations({
      function: this.filters.nicOperation || undefined,
      status: this.filters.operationStatus || undefined,
      // TODO: filter with zone not possible now
      // TODO: decomment once API enable filtering
      // zone: `%${this.filters[this.constructor.normalizeName(this.type)] || ''}%`,
    })
      .then((operationIds) => {
        this.operationIds = operationIds;
      })
      .catch((err) => {
        set(err, 'type', err.type || 'ERROR');
        this.Alerter.alertFromSWS(
          this.$translate.instant('dnss_operations_error'),
          err,
          this.$scope.alerts.main,
        );
      })
      .finally(() => {
        if (isEmpty(this.operationIds)) {
          this.loading.init = false;
        }
      });
  }

  onTransformItemDone() {
    this.loading.init = false;
  }

  static normalizeName(type) {
    return type === 'dns' ? 'zone' : type;
  }
}
