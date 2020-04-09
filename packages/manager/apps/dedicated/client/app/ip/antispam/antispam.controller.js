import get from 'lodash/get';

export default class {
  /* @ngInject */
  constructor($location, $scope, $timeout, $translate, IpSpam) {
    this.$location = $location;
    this.$scope = $scope;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.IpSpam = IpSpam;
  }

  $onInit() {
    this.init();

    this.$scope.loadAntispam = (count, offset) => {
      if (!this.$scope.block) {
        return;
      }

      this.$scope.loadingAntispam = true;

      this.IpSpam.killPollSpamState();

      this.IpSpam.getIpSpam(
        this.$scope.block,
        this.$scope.ipSpamming,
        count,
        offset,
      )
        .then((ipSpamming) => {
          this.$scope.ipspam = ipSpamming;

          // Poll state if pending
          if (ipSpamming && ipSpamming.state === 'UNBLOCKING') {
            this.IpSpam.pollSpamState(
              this.$scope.block,
              this.$scope.ipSpamming,
            ).then((data) => {
              if (
                data &&
                data.state &&
                this.$scope.ipspam &&
                this.$scope.ipspam.state
              ) {
                this.$scope.ipspam.state = data.state;
              }
            });
          }

          this.$scope.loadingAntispam = false;
          this.$scope.loadingPeriods = false;
        })
        .catch((reason) => {
          this.$scope.loadingAntispam = false;
          this.$scope.loadingPeriods = false;

          return this.goToAntispam({
            message: {
              text: this.$translate.instant('ip_antispam_load_error'),
              data: {
                ...reason,
                type: 'ERROR',
              },
            },
          });
        });
    };

    this.$scope.hideAntispam = () => {
      this.IpSpam.killPollSpamState();
      return this.goToDashboard(
        { serviceName: this.serviceName },
        { reload: true },
      );
    };

    this.$scope.$on('$destroy', () => {
      this.IpSpam.killPollSpamState();
    });

    this.$scope.unblockIp = () => {
      this.IpSpam.unblockIp(this.$scope.block, this.$scope.ipspam.ip)
        .then(() => {
          this.init({
            ip: this.$scope.block,
            ipSpamming: this.$scope.ipSpamming,
          });

          return this.goToAntispam({}, { reload: true });
        })
        .catch((data) =>
          this.goToAntispam({
            message: {
              text: this.$translate.instant('ip_antispam_unblock_error', {
                t0: this.$scope.ipspam.ip,
              }),
              data: {
                ...data,
                type: 'ERROR',
              },
            },
          }),
        );
    };
  }

  init(params) {
    this.$scope.ipspam = null;
    this.$scope.block = get(params, 'ip') || this.ip;
    this.$scope.ipSpamming = get(params, 'ipSpamming') || this.ipSpamming;
  }
}
