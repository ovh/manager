import cloneDeep from 'lodash/cloneDeep';
import debounce from 'lodash/debounce';
import find from 'lodash/find';
import has from 'lodash/has';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import remove from 'lodash/remove';
import set from 'lodash/set';

export default class ExchangeResourceDelegationCtrl {
  /* @ngInject */
  constructor(
    $scope,
    wucExchange,
    ExchangeResources,
    $timeout,
    messaging,
    navigation,
    $translate,
  ) {
    this.services = {
      $scope,
      wucExchange,
      ExchangeResources,
      $timeout,
      messaging,
      navigation,
      $translate,
    };

    this.$routerParams = wucExchange.getParams();

    this.resource = navigation.currentActionData;

    this.form = {
      search: null,
    };

    this.buffer = {
      hasChanged: false,
      changes: [],
      selected: [],
      firstView: true,
      ids: [],
    };

    this.debouncedRetrieveDelegationRights = debounce(
      this.retrieveDelegationRights,
      300,
    );
    $scope.retrieveDelegationRights = (count, offset) =>
      this.retrieveDelegationRights(count, offset);
    $scope.updateDelegationRight = () => this.updateDelegationRight();
    $scope.hasChanged = () => this.hasChanged();
    $scope.getDelegationList = () => this.delegationList;
  }

  onSearch() {
    this.debouncedRetrieveDelegationRights();
  }

  resetSearch() {
    this.form.search = null;
    this.services.$scope.$broadcast(
      'paginationServerSide.loadPage',
      1,
      'delegationTable',
    );
  }

  getChanges() {
    const changesList = {
      account: this.resource.resourceEmailAddress,
      delegationRights: [],
    };

    if (this.buffer.changes != null) {
      changesList.delegationRights = this.buffer.changes.map((account) => ({
        id: account.id,
        operation: account.newDelegationValue ? 'POST' : 'DELETE',
      }));
    }

    return changesList;
  }

  trackSelected(account) {
    if (account.newDelegationValue) {
      this.buffer.selected.push(account.id);
    } else {
      remove(this.buffer.selected, (item) => item === account.id);
    }
  }

  checkForChanges(account) {
    this.trackSelected(account);
    this.updateBuffer(account);
  }

  updateBuffer(account) {
    if (account.newDelegationValue !== account.delegation) {
      const buffer = find(this.buffer.changes, {
        id: account.id,
      });

      if (buffer == null) {
        this.buffer.changes.push({
          id: account.id,
          newDelegationValue: account.newDelegationValue,
        });
      }
    } else {
      remove(this.buffer.changes, {
        id: account.id,
      });
    }
  }

  rollChanges(account) {
    const buffer = find(this.buffer.changes, {
      id: account.id,
    });

    if (buffer) {
      set(account, 'newDelegationValue', buffer.newDelegationValue);
    }
  }

  checkboxStateChange(state) {
    const newDelegationValue = state !== 0;
    this.buffer.selected = newDelegationValue ? cloneDeep(this.buffer.ids) : [];

    if (has(this.delegationList, 'list.results')) {
      this.delegationList.list.results.forEach((account) => {
        set(account, 'newDelegationValue', newDelegationValue);

        this.updateBuffer(account);
      });
    }
  }

  hasChangedClass(id) {
    return find(this.buffer.changes, { id })
      ? 'font-weight-bold text-info'
      : null;
  }

  hasChanged() {
    return this.buffer.changes != null && !isEmpty(this.buffer.changes);
  }

  updateDelegationRight() {
    this.services.messaging.writeSuccess(
      this.services.$translate.instant(
        'exchange_RESOURCES_delegation_doing_message',
      ),
    );

    this.services.ExchangeResources.updateResourceDelegation(
      this.$routerParams.organization,
      this.$routerParams.productId,
      this.resource.resourceEmailAddress,
      this.getChanges(),
    )
      .then((data) => {
        this.services.messaging.writeSuccess(
          this.services.$translate.instant(
            'exchange_RESOURCES_delegation_success_message',
          ),
          data,
        );
      })
      .catch((err) => {
        this.services.messaging.writeError(
          this.services.$translate.instant(
            'exchange_RESOURCES_delegation_error_message',
          ),
          err,
        );
      })
      .finally(() => {
        this.services.navigation.resetAction();
      });
  }

  retrieveDelegationRights(count, offset) {
    this.services.messaging.resetMessages();
    this.loading = true;

    return this.services.ExchangeResources.getAccountsByResource(
      this.$routerParams.organization,
      this.$routerParams.productId,
      this.resource.resourceEmailAddress,
      count,
      offset,
      this.form.search,
    )
      .then((accounts) => {
        this.buffer.selected = [];
        this.buffer.ids = map(accounts.list.results, 'id');

        this.delegationList = accounts; // make a deep copy of accounts list to use it as model

        if (has(this.delegationList, 'list.results')) {
          this.delegationList.list.results.forEach((account) => {
            set(account, 'newDelegationValue', account.delegation);

            // roll previous buffered changes
            this.rollChanges(account);
            this.trackSelected(account);
          });
        }
      })
      .catch((err) => {
        this.services.messaging.writeError(
          this.services.$translate.instant(
            'exchange_RESOURCES_delegation_loading_error_message',
          ),
          err,
        );
      })
      .finally(() => {
        this.loading = false;
      });
  }
}
