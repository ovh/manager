import debounce from 'lodash/debounce';
import find from 'lodash/find';
import forEach from 'lodash/forEach';
import has from 'lodash/has';
import head from 'lodash/head';
import isEmpty from 'lodash/isEmpty';
import isNaN from 'lodash/isNaN';

export default class ExchangeAddGroupCtrl {
  /* @ngInject */
  constructor($scope, wucExchange, navigation, messaging, $translate, group) {
    this.services = {
      $scope,
      wucExchange,
      navigation,
      messaging,
      $translate,
      group,
    };

    this.$routerParams = wucExchange.getParams();

    this.groupToAdd = {
      auth: false,
      hiddenFromGAL: false,
      sentSizeUnlimited: true,
      receiveSizeUnlimited: true,
      maxSendSize: 100,
      maxReceiveSize: 100,
    };

    this.search = {
      value: null,
    };

    this.model = {
      managersList: [],
      membersList: [],
    };

    this.debouncedGetAccounts = debounce(this.getAccounts, 300);

    $scope.getAccountList = () => this.getAccountList();
    $scope.addExchangeGroup = () => this.addExchangeGroup();
    $scope.groupIsValid = () => this.groupIsValid();
    $scope.retrievingOptionsToCreateNewGroup = () =>
      this.retrievingOptionsToCreateNewGroup();
    $scope.getLoading = () => this.getLoading();
    $scope.getAccounts = (count, offset) => this.getAccounts(count, offset);
  }

  getLoading() {
    return this.loading;
  }

  getAccountList() {
    return this.accountsList;
  }

  prepareModel() {
    this.model.displayName =
      this.groupToAdd.displayName === '' ? null : this.groupToAdd.displayName;
    this.model.domain = this.groupToAdd.completeDomain.name;
    this.model.address = this.groupToAdd.address;
    this.model.senderAuthentification = this.groupToAdd.auth;
    this.model.hiddenFromGAL = this.groupToAdd.hiddenFromGAL;
    this.model.maxSendSize = this.groupToAdd.sentSizeUnlimited
      ? null
      : this.groupToAdd.maxSendSize;
    this.model.maxReceiveSize = this.groupToAdd.receiveSizeUnlimited
      ? null
      : this.groupToAdd.maxReceiveSize;
    this.model.joinRestriction = this.groupToAdd.subscribeRestriction;
    this.model.departRestriction = this.groupToAdd.unsubscribeRestriction;
    this.model.company =
      this.groupToAdd.company === '' ? null : this.groupToAdd.company;

    this.saveSelected();
  }

  saveSelected() {
    if (has(this.accountsList, 'list.results')) {
      forEach(this.accountsList.list.results, (account) => {
        this.saveManagers(account);
        this.saveMembers(account);
      });
    }
  }

  saveManagers(account) {
    const managerObject = find(
      this.model.managersList,
      (manager) => manager.id === account.id,
    );

    if (account.manager && managerObject == null) {
      this.model.managersList.push({
        id: account.id,
        operation: 'POST',
      });
    }
  }

  saveMembers(account) {
    const memberObject = find(
      this.model.membersList,
      (member) => member.id === account.id,
    );

    if (account.member && memberObject == null) {
      this.model.membersList.push({
        id: account.id,
        operation: 'POST',
        itemType: account.type,
      });
    }
  }

  loadSelected() {
    this.loadManagers();
    this.loadMembers();
  }

  loadManagers() {
    if (this.model.managersList != null) {
      forEach(this.model.managersList, (account) => {
        const toLoad = find(
          this.accountsList.list.results,
          (manager) => manager.id === account.id,
        );

        if (toLoad != null) {
          toLoad.manager = true;
        }
      });
    }
  }

  loadMembers() {
    if (this.model.membersList != null) {
      forEach(this.model.membersList, (account) => {
        const toLoad = find(
          this.accountsList.list.results,
          (member) => member.id === account.id,
        );

        if (toLoad != null) {
          toLoad.member = true;
        }
      });
    }
  }

  resetSearch() {
    this.search.value = null;
    this.services.$scope.$broadcast(
      'paginationServerSide.loadPage',
      1,
      'accountsByGroupTable',
    );
  }

  retrievingOptionsToCreateNewGroup() {
    return this.services.group
      .retrievingOptionsToCreateNewGroup(
        this.$routerParams.organization,
        this.$routerParams.productId,
      )
      .then((data) => {
        this.optionsToCreateANewGroup = data;

        if (isEmpty(data.availableDomains)) {
          this.services.messaging.writeError(
            this.services.$translate.instant('exchange_ACTION_add_no_domains'),
          );
          this.services.navigation.resetAction();
        } else {
          this.groupToAdd.completeDomain = head(data.availableDomains);
          this.groupToAdd.subscribeRestriction = head(
            data.availableJoinRestrictions,
          );
          this.groupToAdd.unsubscribeRestriction = head(
            data.availableDepartRestrictions,
          );
          this.groupIsValid();
        }
      })
      .catch((failure) => {
        this.services.navigation.resetAction();
        this.services.messaging.writeError(
          this.services.$translate.instant(
            'exchange_ACTION_add_account_option_fail',
          ),
          failure,
        );
      });
  }

  groupIsValid() {
    const isDomainPresent = this.groupToAdd.completeDomain != null;
    const isAddressPresent = this.groupToAdd.address != null;

    const maxReceiveSize = parseInt(this.groupToAdd.maxReceiveSize, 10);
    const isReceiveSizeCorrect =
      this.groupToAdd.receiveSizeUnlimited ||
      (!isNaN(maxReceiveSize) && maxReceiveSize >= 0 && maxReceiveSize <= 100);

    const maxSendSize = parseInt(this.groupToAdd.maxSendSize, 10);
    const isSentSizeCorrect =
      this.groupToAdd.sentSizeUnlimited ||
      (!isNaN(maxSendSize) && maxSendSize >= 0 && maxSendSize <= 100);

    const isSubscriptionPresent =
      this.groupToAdd.subscribeRestriction != null &&
      this.groupToAdd.unsubscribeRestriction != null;

    return (
      isDomainPresent &&
      isAddressPresent &&
      isReceiveSizeCorrect &&
      isSentSizeCorrect &&
      isSubscriptionPresent
    );
  }

  onSearchValueChange() {
    this.debouncedGetAccounts();
  }

  getAccounts(count, offset) {
    this.services.messaging.resetMessages();
    this.loading = true;
    this.saveSelected();

    this.services.wucExchange
      .getAccountsAndContacts(
        this.$routerParams.organization,
        this.$routerParams.productId,
        count,
        offset,
        this.search.value,
        1,
      )
      .then((accounts) => {
        this.accountsList = accounts;

        if (this.accountsList != null) {
          this.loadSelected();
        }
      })
      .catch((failure) => {
        this.services.messaging.writeError(
          this.services.$translate.instant(
            'exchange_tab_ACCOUNTS_error_message',
          ),
          failure,
        );
      })
      .finally(() => {
        this.loading = false;
        this.services.$scope.$broadcast(
          'paginationServerSide.loadPage',
          1,
          'accountsByGroupTable',
        );
      });
  }

  addExchangeGroup() {
    this.services.messaging.writeSuccess(
      this.services.$translate.instant('exchange_dashboard_action_doing'),
    );

    this.prepareModel();
    this.services.wucExchange
      .addExchangeGroup(
        this.$routerParams.organization,
        this.$routerParams.productId,
        this.model,
      )
      .then((data) => {
        const addGroupMessages = {
          OK: this.services.$translate.instant(
            'exchange_GROUPS_add_group_success',
          ),
          PARTIAL: this.services.$translate.instant(
            'exchange_GROUPS_add_group_partial',
          ),
          ERROR: this.services.$translate.instant(
            'exchange_GROUPS_add_group_fail',
          ),
        };

        this.services.messaging.setMessage(addGroupMessages, data);
      })
      .catch((failure) => {
        this.services.messaging.writeError(
          this.services.$translate.instant('exchange_GROUPS_add_group_fail'),
          failure,
        );
      })
      .finally(() => {
        this.services.navigation.resetAction();
      });
  }
}
