export default class ExchangeTabMembersByGroupsCtrl {
  /* @ngInject */
  constructor(
    $scope,
    wucExchange,
    $timeout,
    messaging,
    navigation,
    $translate,
    goToGroup,
    group,
  ) {
    this.services = {
      $scope,
      wucExchange,
      $timeout,
      messaging,
      navigation,
      $translate,
      group,
    };

    this.$routerParams = wucExchange.getParams();
    this.groupParams = {};
    this.goToGroup = goToGroup;

    $scope.$on(wucExchange.events.accountsChanged, () => this.refreshList());
    $scope.getMembersList = () => this.membersList;
    $scope.getMembersByGroup = (pageSize, offset) =>
      this.getMembersByGroup(pageSize, offset);
  }

  getMembersByGroup({ pageSize, offset }) {
    this.groupParams.pageSize = pageSize;
    this.groupParams.offset = offset;
    this.services.messaging.resetMessages();

    return this.services.group
      .retrievingMembersByGroup(
        this.$routerParams.organization,
        this.$routerParams.productId,
        this.$routerParams.group,
        pageSize,
        offset - 1,
      )
      .then((accounts) => {
        this.membersList = accounts.list.results;
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
      .retrievingMembersByGroup(
        this.$routerParams.organization,
        this.$routerParams.productId,
        this.$routerParams.group,
        this.groupParams.pageSize,
        this.groupParams.offset - 1,
      )
      .then((data) => {
        for (let i = 0; i < data.list.results.length; i += 1) {
          this.membersList.splice(i, 1, data.list.results[i]);
        }
        for (
          let i = data.list.results.length;
          i < this.membersList.length;
          i += 1
        ) {
          this.membersList.splice(i, 1);
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

  removeMember(member) {
    this.services.navigation.setAction(
      'exchange/group/member/remove/group-member-remove',
      {
        member,
      },
    );
  }
}
