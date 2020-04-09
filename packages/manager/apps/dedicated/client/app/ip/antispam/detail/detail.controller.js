export default class {
  /* @ngInject */
  constructor($scope, $timeout, $translate, IpSpam) {
    this.$scope = $scope;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.IpSpam = IpSpam;
  }

  $onInit() {
    this.$scope.goBack = this.goBack.bind(this);
    this.$scope.tableLoading = false;
    this.$scope.details = null;
    this.$scope.pageSizes = [5, 10, 15];

    this.$scope.model = {
      block: this.block,
      ip: this.ip,
      timestamp: this.timestamp,
      search: null,
    };

    this.$scope.$watch(
      'model.search',
      (newValue) => {
        if (this.$scope.model.search !== null) {
          if (this.$scope.model.search === '') {
            this.$scope.$broadcast(
              'paginationServerSide.loadPage',
              1,
              'antispamDetails',
            );
          } else {
            this.$scope.searchLoading = true;
            this.$timeout(() => {
              if (this.$scope.model.search === newValue) {
                this.$scope.$broadcast(
                  'paginationServerSide.loadPage',
                  1,
                  'antispamDetails',
                );
              }
            }, 500);
          }
        }
      },
      true,
    );

    this.$scope.loadSpams = (count, offset) => {
      this.$scope.tableLoading = true;
      this.IpSpam.getIpSpamStats(
        this.$scope.model.block,
        this.$scope.model.ip,
        this.$scope.model.timestamp,
        count,
        offset,
        this.$scope.model.search,
      )
        .then((stats) => {
          this.$scope.details = stats;
          this.$scope.tableLoading = false;
        })
        .catch((reason) => {
          this.$scope.tableLoading = false;

          return this.goBack({
            message: {
              text: this.$translate.instant(
                'server_configuration_mitigation_auto_success',
              ),
              data: {
                ...reason,
                type: 'ERROR',
              },
            },
          });
        });
    };
  }
}
