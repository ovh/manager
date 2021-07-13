import clone from 'lodash/clone';
import find from 'lodash/find';
import get from 'lodash/get';

export default class IpReverseUpdateCtrl {
  /* @ngInject */
  constructor(
    $location,
    $q,
    $scope,
    $rootScope,
    $translate,
    Alerter,
    Ip,
    IpReverse,
    Validator,
  ) {
    this.$location = $location;
    this.$q = $q;
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.Ip = Ip;
    this.IpReverse = IpReverse;
    this.Validator = Validator;
  }

  $onInit() {
    // Come from URL
    if (
      this.$location.search().action === 'reverse' &&
      this.$location.search().ip
    ) {
      this.loading = true;
      return this.$q
        .all({
          ipDetails: this.Ip.getIpDetails(this.$location.search().ipBlock),
          serviceList: this.Ip.getServicesList(),
        })
        .then(({ ipDetails, serviceList }) => {
          const serviceForIp = find(
            serviceList,
            (service) => ipDetails.routedTo.serviceName === service.serviceName,
          );
          if (serviceForIp) {
            this.ip = { ip: this.$location.search().ip };
            this.ipBlock = {
              ipBlock: this.$location.search().ipBlock,
              service: serviceForIp,
            };
          }
        })
        .catch((error) =>
          this.Alerter.alertFromSWS(
            this.$translate.instant('ip_dashboard_error'),
            error,
          ),
        )
        .then(() =>
          this.IpReverse.getReverse(
            this.$location.search().ipBlock,
            this.$location.search().ip,
          ),
        )
        .then((reverseData) => {
          this.model = { reverse: clone(reverseData.reverse) };
        }) // if error > reverse is init to '' > nothing more to do
        .finally(() => {
          this.loading = false;
        });
    }
    this.ip = this.$scope.currentActionData.ip;
    this.ipBlock = this.$scope.currentActionData.ipBlock;
    this.model = {
      reverse: this.ip.reverse ? punycode.toUnicode(this.ip.reverse) : '',
    };
    return this.$q.when();
  }

  updateReverse() {
    this.loading = true;

    // If not modified, return
    if (
      this.model.reverse &&
      punycode.toASCII(this.model.reverse) === this.ip.reverse
    ) {
      return this.$scope.resetAction();
    }

    return this.IpReverse.updateReverse(
      this.ipBlock,
      this.ip.ip,
      this.model.reverse,
    )
      .then(() => {
        this.$rootScope.$broadcast('ips.table.refreshBlock', this.ipBlock);
        this.Alerter.success(
          this.$translate.instant('ip_table_manage_reverse_success'),
        );
      })
      .catch((error) =>
        this.Alerter.alertFromSWS(
          this.$translate.instant('ip_table_manage_reverse_failure', {
            message: get(error, 'data.message'),
          }),
        ),
      )
      .finally(() => this.cancelAction());
  }

  isValid() {
    return (
      this.model.reverse &&
      this.Validator.isValidDomain(this.model.reverse.replace(/\.$/, ''))
    );
  }

  cancelAction() {
    this.Ip.cancelActionParam('reverse');
    this.$scope.resetAction();
  }
}
