export default class SecondaryDnsCtrl {
  /* @ngInject */
  constructor($scope, $timeout, $translate, Server) {
    this.$scope = $scope;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.Server = Server;
  }

  $onInit() {
    this.$scope.$on('dedicated.secondarydns.reload', this.refresh());
  }

  loadSecondaryDns({ offset, pageSize }) {
    return this.Server.getSecondaryDnsList(
      this.server.name,
      pageSize,
      offset - 1,
    ).then(
      (result) => ({
        data: result.list?.results,
        meta: {
          totalCount: result.count,
        },
      }),
      (err) => {
        this.$scope.setMessage(
          this.$translate.instant('server_secondary_dns_fail'),
          { ...err, type: 'ERROR' },
        );
      },
    );
  }

  refresh() {
    this.reload = true;
    this.$timeout(() => {
      this.reload = false;
    });
  }
}
