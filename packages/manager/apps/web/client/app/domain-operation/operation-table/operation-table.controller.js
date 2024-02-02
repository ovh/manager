import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import { ALERTER_ID, DEFAULT_FILTER_COLUMN } from './operation-table.constants';

export default class OperationTableController extends ListLayoutHelper.ListLayoutCtrl {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    $scope,
    $timeout,
    wucExchange,
    ouiDatagridService,
  ) {
    super($q, ouiDatagridService);
    this.$translate = $translate;
    this.$scope = $scope;
    this.$routerParams = wucExchange.getParams();
    this.$timeout = $timeout;
  }

  $onInit() {
    this.id = 'datagridOperation';
    this.defaultFilterColumn = DEFAULT_FILTER_COLUMN[this.type];
    super.$onInit();

    this.columnsConfig = [
      {
        name: this.defaultFilterColumn,
        sortable: this.getSorting(this.defaultFilterColumn),
      },
      { name: 'function', sortable: this.getSorting('function') },
      { name: 'comment', sortable: this.getSorting('comment') },
      { name: 'todoDate', sortable: this.getSorting('todoDate') },
      { name: 'lastUpdate', sortable: this.getSorting('lastUpdate') },
      { name: 'doneDate', sortable: this.getSorting('doneDate') },
      { name: 'status', sortable: this.getSorting('status') },
    ];

    this.operationFunctionColumnOptions = {
      hideOperators: true,
      values: this.operationFunctionEnum.reduce(
        (options, status) => ({
          ...options,
          [status]: this.$translate.instant(
            `domain_operations_nicOperation_${status}`,
          ),
        }),
        {},
      ),
    };

    this.operationStatusColumnOptions = {
      hideOperators: true,
      values: this.operationStatusEnum.reduce(
        (options, status) => ({
          ...options,
          [status]: this.$translate.instant(
            `domain_operations_statusOperation_${status}`,
          ),
        }),
        {},
      ),
    };

    this.stepPath = '';

    this.alertId = ALERTER_ID;
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

    this.$scope.$on('$locationChangeStart', () => {
      this.$scope.resetAction();
    });
  }

  refreshOperationTable() {
    return this.ouiDatagridService.refresh(this.id, true);
  }
}
