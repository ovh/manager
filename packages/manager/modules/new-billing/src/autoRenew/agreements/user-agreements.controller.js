import { AGREEMENTS_STATUS, COLUMNS_CONFIG } from './user-agreements.constant';

export default class UserAccountAgreementsController {
  /* @ngInject */
  constructor(
    $scope,
    $translate,
    Alerter,
    atInternet,
    UserAccountServicesAgreements,
  ) {
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.atInternet = atInternet;
    this.UserAccountServicesAgreements = UserAccountServicesAgreements;

    this.loaders = {
      toActivate: true,
      toActivateList: true,
    };
    this.toActivate = [];
    this.agreed = {};
  }

  $onInit() {
    this.filtersOptions = {
      state: {
        hideOperators: true,
        values: [AGREEMENTS_STATUS.TODO, AGREEMENTS_STATUS.OK].reduce(
          (values, status) => ({
            ...values,
            [status.toLowerCase()]: this.$translate.instant(
              `user_agreements_status_${status}`,
            ),
          }),
          {},
        ),
      },
    };

    this.criteria = [];
    if (this.state) {
      this.criteria.push({
        property: 'state',
        value: this.state,
        operator: 'is',
        title: `${this.$translate.instant(
          'user_agreements_status',
        )} ${this.$translate.instant(
          'common_criteria_adder_operator_options_is',
        )} ${this.$translate.instant(
          `user_agreements_status_${this.state.toUpperCase()}`,
        )}`,
      });
    }

    this.getToValidate();

    if (this.sorting?.predicate) {
      this.columnsConfig = COLUMNS_CONFIG.map((column) =>
        column.property === this.sorting.predicate
          ? {
              ...this.columnsConfig,
              sortable: this.sorting.reverse ? 'desc' : 'asc',
            }
          : column,
      );
    }
  }

  loadAgreementsList({ pageSize, offset }) {
    return this.UserAccountServicesAgreements.getList(
      pageSize,
      offset,
      this.state,
      this.sorting,
    )
      .then(
        (agreements) => {
          return {
            data: agreements.list.results,
            meta: {
              totalCount: agreements.count,
            },
          };
        },
        (err) => {
          this.Alerter.error(
            `${this.$translate.instant(
              'user_agreements_error',
            )} ${err?.message || err}`,
            'agreements_alerter',
          );
          return {
            data: [],
            meta: {
              totalCount: 0,
            },
          };
        },
      )
      .finally(() => {
        this.loading = false;
      });
  }

  getToValidate() {
    this.toActivate = [];
    this.loaders.toActivate = true;

    this.UserAccountServicesAgreements.getToValidate().then(
      (agreements) => {
        this.toActivate = agreements;
        this.loaders.toActivate = false;
      },
      angular.noop,
      (contract) => {
        this.toActivate.push(contract);
        this.agreed[contract.id] = false;
      },
    );
  }

  onPageChange({ pageSize, offset }) {
    this.onQueryParamsChange({
      page: parseInt(offset / pageSize, 10) + 1,
      itemsPerPage: pageSize,
    });
  }

  onSortChange({ name, order }) {
    this.onQueryParamsChange({
      sorting: JSON.stringify({ predicate: name, reverse: order === 'DESC' }),
    });
  }

  onCriteriaChange($criteria) {
    const stateCriteria = $criteria.find(
      (criteria) => criteria.property === 'state',
    );
    this.onQueryParamsChange({
      state: stateCriteria?.value || null,
    });
  }

  accept(contract) {
    this.atInternet.trackClick({
      name:
        'dedicated::account::billing::autorenew::agreements::go-to-accept-agreement',
      type: 'action',
    });
    this.loaders[`accept_${contract.id}`] = true;

    this.UserAccountServicesAgreements.accept(contract)
      .then(
        () => {
          this.getToValidate();
        },
        (error) => {
          this.Alerter.set(
            'alert-danger',
            `${this.$translate.instant('user_agreement_details_error')} ${error
              ?.data?.message || error}`,
            null,
            'agreements_alerter',
          );
        },
      )
      .finally(() => {
        this.loaders[`accept_${contract.id}`] = false;
      });
  }

  resetMessages() {
    this.Alerter.resetMessage('agreements_alerter');
  }
}
