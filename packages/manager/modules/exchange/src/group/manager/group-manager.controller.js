export default class ExchangeTabManagersByGroupsCtrl {
  /* @ngInject */
  constructor(
    $scope,
    wucExchange,
    navigation,
    messaging,
    $translate,
    goToGroup,
    group,
  ) {
    this.services = {
      $scope,
      wucExchange,
      navigation,
      messaging,
      $translate,
      group,
    };

    this.$routerParams = wucExchange.getParams();
    this.groupParams = {};
    this.goToGroup = goToGroup;

    $scope.$on(wucExchange.events.accountsChanged, () => this.refreshList());
    $scope.getManagersList = () => this.managersList;
    $scope.getManagersByGroup = (pageSize, offset) =>
      this.getManagersByGroup(pageSize, offset);
  }

  getManagersByGroup({ pageSize, offset }) {
    this.groupParams.pageSize = pageSize;
    this.groupParams.offset = offset;
    this.services.messaging.resetMessages();

    return this.services.group
      .retrievingManagersByGroup(
        this.$routerParams.organization,
        this.$routerParams.productId,
        this.$routerParams.group,
        pageSize,
        offset - 1,
      )
      .then((accounts) => {
        this.managersList = accounts.list.results;
        return {
          data: accounts.list.results,
          meta: {
            totalCount: accounts.count,
          },
        };
      })
      .catch((failure) =>
        this.services.messaging.writeError(
          this.services.$translate.instant(
            'exchange_tab_ACCOUNTS_error_message',
          ),
          failure,
        ),
      );
  }

  refreshList() {
    this.services.group
      .retrievingManagersByGroup(
        this.$routerParams.organization,
        this.$routerParams.productId,
        this.$routerParams.group,
        this.groupParams.pageSize,
        this.groupParams.offset - 1,
      )
      .then((data) => {
        for (let i = 0; i < data.list.results.length; i += 1) {
          this.managersList.splice(i, 1, data.list.results[i]);
        }
        for (
          let i = data.list.results.length;
          i < this.managersList.length;
          i += 1
        ) {
          this.managersList.splice(i, 1);
        }
      })
      .catch((failure) =>
        this.services.messaging.writeError(
          this.services.$translate.instant(
            'exchange_tab_ACCOUNTS_error_message',
          ),
          failure,
        ),
      );
  }

  removeManager(manager) {
    this.services.navigation.setAction(
      'exchange/group/manager/remove/group-manager-remove',
      {
        manager,
      },
    );
  }
}
