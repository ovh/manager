import angular from 'angular';
import find from 'lodash/find';
import get from 'lodash/get';
import last from 'lodash/last';
import sortBy from 'lodash/sortBy';

export default class ExchangeGroupAccountsCtrl {
  /* @ngInject */
  constructor(
    $scope,
    $translate,
    wucExchange,
    messaging,
    navigation,
    ouiDatagridService,
  ) {
    this.services = {
      $scope,
      wucExchange,
      messaging,
      navigation,
      $translate,
      ouiDatagridService,
    };

    this.$routerParams = wucExchange.getParams();

    this.timeout = null;
    this.selectedGroup = navigation.currentActionData;
    this.availableDomains = [];
    this.loadingDomains = false;
    this.currentAccount = this.services.navigation.currentActionData.mailingListAddress;
    this.allDomainsOption = {
      displayName: this.services.$translate.instant('exchange_all_domains'),
      name: '',
    };
    this.selectedDomain = this.getDefaultDomain();

    this.search = {
      value: null,
    };

    this.model = {
      displayName: this.selectedGroup.displayName,
      senderAuthentification: this.selectedGroup.senderAuthentification,
      hiddenFromGAL: this.selectedGroup.hiddenFromGAL,
      joinRestriction: this.selectedGroup.joinRestriction,
      departRestriction: this.selectedGroup.departRestriction,
      managersList: [],
      membersList: [],
    };
    this.fetchAccountCreationOptions();
  }

  onDomainValueChange() {
    // clear filter by free text search
    this.search.value = null;
    this.refreshDatagrid('group-accounts', true);
  }

  refreshDatagrid(datagridId, showSpinner) {
    this.services.ouiDatagridService.refresh(datagridId, showSpinner);
  }

  updateManagersList(newManagerValue, account) {
    const bufferedAccount = this.accountsListBuffer.list.results.find(
      ({ id }) => id === account.id,
    );

    if (newManagerValue !== get(bufferedAccount, 'manager')) {
      this.model.managersList.push({
        id: account.id,
        operation: newManagerValue ? 'POST' : 'DELETE',
        itemType: account.type,
      });
    }
  }

  updateMembersList(newMemberValue, account) {
    const bufferedAccount = this.accountsListBuffer.list.results.find(
      ({ id }) => id === account.id,
    );

    if (newMemberValue !== get(bufferedAccount, 'member')) {
      this.model.membersList.push({
        id: account.id,
        operation: newMemberValue ? 'POST' : 'DELETE',
        itemType: account.type,
      });
    }
  }

  applySelection(account) {
    const accountInManagerList = this.model.managersList.find(
      ({ id }) => id === account.id,
    );
    const accountInMemberList = this.model.membersList.find(
      ({ id }) => id === account.id,
    );

    const managerValue = accountInManagerList
      ? get(accountInManagerList, 'operation') === 'POST'
      : account.manager;
    const memberValue = accountInMemberList
      ? get(accountInMemberList, 'operation') === 'POST'
      : account.member;

    return {
      ...account,
      manager: managerValue,
      member: memberValue,
    };
  }

  getDefaultDomain() {
    const name = last(this.currentAccount.split('@'));
    return {
      displayName: name,
      name,
    };
  }

  fetchAccountCreationOptions() {
    this.loadingDomains = true;
    return this.services.wucExchange
      .fetchingAccountCreationOptions(
        this.$routerParams.organization,
        this.$routerParams.productId,
      )
      .then((accountCreationOptions) => {
        this.availableDomains = [
          this.allDomainsOption,
          ...accountCreationOptions.availableDomains,
        ];
        this.selectedDomain = find(
          accountCreationOptions.availableDomains,
          (domain) => domain.name === this.selectedDomain.name,
        );
      })
      .catch((error) => {
        this.services.messaging.writeError(
          this.services.$translate.instant(
            'exchange_accounts_fetchAccountCreationOptions_error',
          ),
          error,
        );
      })
      .finally(() => {
        this.loadingDomains = false;
      });
  }

  getAccounts({ pageSize, offset, criteria }) {
    const [search] = criteria;
    this.services.messaging.resetMessages();
    if (get(search, 'value')) {
      // clear filter by domain name
      this.selectedDomain = this.allDomainsOption;
    }
    const filter = get(search, 'value') || get(this.selectedDomain, 'name');
    return this.services.wucExchange
      .getAccountsByGroup(
        this.$routerParams.organization,
        this.$routerParams.productId,
        this.selectedGroup.mailingListAddress,
        pageSize,
        offset - 1,
        filter,
      )
      .then((accounts) => {
        this.accountsListBuffer = accounts;
        this.accountsList = angular.copy(accounts);
        return {
          data: sortBy(accounts.list.results, 'formattedAddress').concat(
            sortBy(accounts.list.messages, 'id'),
          ),
          meta: {
            totalCount: accounts.count,
          },
        };
      })
      .catch((failure) => {
        this.services.messaging.writeError(
          this.services.$translate.instant(
            'exchange_tab_ACCOUNTS_error_message',
          ),
          failure,
        );
        this.services.navigation.resetAction();
      });
  }

  updateAccounts() {
    this.services.messaging.writeSuccess(
      this.services.$translate.instant('exchange_dashboard_action_doing'),
    );

    this.services.wucExchange
      .updateGroups(
        this.$routerParams.organization,
        this.$routerParams.productId,
        this.selectedGroup.mailingListAddress,
        this.model,
      )
      .then((data) => {
        const addGroupMessages = {
          OK: this.services.$translate.instant(
            'exchange_GROUPS_settings_success_message',
            {
              t0: this.selectedGroup.mailingListDisplayName,
            },
          ),
          PARTIAL: this.services.$translate.instant(
            'exchange_GROUPS_settings_partial_message',
            {
              t0: this.selectedGroup.mailingListDisplayName,
            },
          ),
          ERROR: this.services.$translate.instant(
            'exchange_GROUPS_settings_error_message',
            {
              t0: this.selectedGroup.mailingListDisplayName,
            },
          ),
        };

        if (data == null) {
          this.services.messaging.writeSuccess(
            this.services.$translate.instant(
              'exchange_GROUPS_settings_success_message',
              {
                t0: this.selectedGroup.mailingListDisplayName,
              },
            ),
          );
        } else {
          this.services.messaging.setMessage(addGroupMessages, data);
        }
      })
      .catch((failure) => {
        this.services.messaging.writeError(
          this.services.$translate.instant(
            'exchange_GROUPS_settings_error_message',
            {
              t0: this.selectedGroup.mailingListDisplayName,
            },
          ),
          failure,
        );
      })
      .finally(() => {
        this.services.navigation.resetAction();
      });
  }
}
