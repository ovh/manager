import get from 'lodash/get';

export default class {
  /* @ngInject */
  constructor($translate, Ip, IpDashboardReverse, Validator) {
    this.$translate = $translate;
    this.Ip = Ip;
    this.IpDashboardReverse = IpDashboardReverse;
    this.Validator = Validator;
  }

  $onInit() {
    this.model = {
      reverse: this.ip.reverse ? punycode.toUnicode(this.ip.reverse) : '',
    };
  }

  updateReverse() {
    this.loading = true;

    // If not modified, return
    if (
      this.model.reverse &&
      punycode.toASCII(this.model.reverse) === this.ip.reverse
    ) {
      return this.goBack({}, { reload: true });
    }

    return this.IpDashboardReverse.updateReverse(
      this.ipBlock,
      this.ip.ip,
      this.model.reverse,
    )
      .then(() =>
        this.goBack(
          {
            message: {
              text: this.$translate.instant('ip_table_manage_reverse_success'),
              data: 'OK',
            },
          },
          { reload: true },
        ),
      )
      .catch((error) =>
        this.goBack({
          message: {
            text: this.$translate.instant('ip_table_manage_reverse_failure', {
              message: get(error, 'data.message'),
            }),
            data: 'ERROR',
          },
        }),
      );
  }

  isValid() {
    return (
      this.model.reverse &&
      this.Validator.isValidDomain(this.model.reverse.replace(/\.$/, ''))
    );
  }

  cancelAction(transitionParams = {}) {
    return this.goBack({}, transitionParams);
  }
}
