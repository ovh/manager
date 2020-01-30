export default class ExchangeTabManagersByGroupsCtrl {
  /* @ngInject */
  constructor($scope, Exchange, navigation, messaging, $translate, group) {
    this.services = {
      $scope,
      Exchange,
      navigation,
      messaging,
      $translate,
      group,
    };

    this.$routerParams = Exchange.getParams();
    this.groupParams = {};

    $scope.$on(Exchange.events.accountsChanged, () => this.refreshList());
    $scope.getManagersList = () => this.managersList;
    $scope.getManagersByGroup = (pageSize, offset) =>
      this.getManagersByGroup(pageSize, offset);
  }

  hide() {
    this.services.$scope.$emit('showGroups');
  }

  getManagersByGroup({ pageSize, offset }) {
    this.groupParams.pageSize = pageSize;
    this.groupParams.offset = offset;
    this.services.messaging.resetMessages();

    return this.services.group
      .retrievingManagersByGroup(
        this.$routerParams.organization,
        this.$routerParams.productId,
        this.services.navigation.selectedGroup.mailingListName,
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
        this.services.navigation.selectedGroup.mailingListName,
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
        group: this.services.navigation.selectedGroup,
        manager,
      },
    );
  }
}
