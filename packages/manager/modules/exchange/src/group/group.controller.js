import angular from 'angular';

export default class ExchangeTabGroupsCtrl {
  /* @ngInject */
  constructor(
    $scope,
    Exchange,
    navigation,
    messaging,
    $translate,
    exchangeStates,
    goToAlias,
    goToManager,
    goToMembers,
  ) {
    this.services = {
      $scope,
      Exchange,
      navigation,
      messaging,
      $translate,
      exchangeStates,
    };

    this.$routerParams = Exchange.getParams();

    this.loading = false;
    this.mailingLists = null;
    this.search = null;
    this.services.navigation.selectedGroup = null;

    $scope.$on(Exchange.events.groupsChanged, () =>
      $scope.$broadcast('paginationServerSide.reload', 'groupsTable'),
    );

    $scope.getLoading = () => this.getLoading();
    $scope.getMailingListObjects = () => this.getMailingListObjects();
    $scope.getMailingLists = (count, offset) =>
      this.getMailingLists(count, offset);

    this.goToAlias = goToAlias;
    this.goToManager = goToManager;
    this.goToMembers = goToMembers;
  }

  onSearchValueChange() {
    this.getMailingLists();
  }

  displayManagersByGroup(ml) {
    this.search = null;
    this.goToManager(ml);
    this.services.navigation.selectedGroup = ml;
    this.services.$scope.$broadcast(
      'paginationServerSide.loadPage',
      1,
      'managersTable',
    );
  }

  displayMembersByGroup(ml) {
    this.search = null;
    this.goToMembers(ml);
    this.services.navigation.selectedGroup = ml;
    this.services.$scope.$broadcast(
      'paginationServerSide.loadPage',
      1,
      'membersTable',
    );
  }

  displayAliasesByGroup(ml) {
    this.search = null;
    this.goToAlias(ml);
    this.services.navigation.selectedGroup = ml;
    this.services.$scope.$broadcast(
      'paginationServerSide.loadPage',
      1,
      'groupAliasTable',
    );
  }

  getLoading() {
    return this.loading;
  }

  resetSearch() {
    this.search.value = null;
    this.services.$scope.$broadcast(
      'paginationServerSide.loadPage',
      1,
      'groupsTable',
    );
  }

  getMailingListObjects() {
    return this.mailingLists;
  }

  getMailingLists(count, offset) {
    this.services.messaging.resetMessages();
    this.loading = true;

    this.services.Exchange.getGroups(
      this.$routerParams.organization,
      this.$routerParams.productId,
      count,
      offset,
      this.search ? this.search.value : '',
    )
      .then((data) => {
        this.mailingLists = data;
      })
      .catch((failure) => {
        this.services.messaging.writeError(
          this.services.$translate.instant(
            'exchange_tab_GROUPS_all_error_message',
          ),
          failure,
        );
      })
      .finally(() => {
        this.services.$scope.$broadcast(
          'paginationServerSide.loadPage',
          1,
          'groupsTable',
        );
        this.loading = false;
      });
  }

  newGroup() {
    this.services.navigation.setAction('exchange/group/add/group-add');
  }

  updateGroup(ml) {
    if (this.services.exchangeStates.constructor.isOk(ml)) {
      this.services.navigation.setAction(
        'exchange/group/update/group-update',
        angular.copy(ml),
      );
    }
  }

  updateAccounts(ml) {
    if (this.services.exchangeStates.constructor.isOk(ml)) {
      this.services.navigation.setAction(
        'exchange/group/accounts/group-accounts',
        angular.copy(ml),
      );
    }
  }

  deleteGroup(ml) {
    if (this.services.exchangeStates.constructor.isOk(ml)) {
      this.services.navigation.setAction(
        'exchange/group/remove/group-remove',
        angular.copy(ml),
      );
    }
  }

  addGroupAlias(ml) {
    if (this.services.exchangeStates.constructor.isOk(ml)) {
      this.services.navigation.setAction(
        'exchange/group/alias/add/group-alias-add',
        angular.copy(ml),
      );
    }
  }

  groupDelegation(ml) {
    if (this.services.exchangeStates.constructor.isOk(ml)) {
      this.services.navigation.setAction(
        'exchange/group/delegation/group-delegation',
        angular.copy(ml),
      );
    }
  }
}
