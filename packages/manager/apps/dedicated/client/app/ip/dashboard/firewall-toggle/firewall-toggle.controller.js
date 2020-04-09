export default class {
  /* @ngInject */
  constructor($scope, $translate, IpFirewall) {
    this.$scope = $scope;
    this.$translate = $translate;
    this.IpFirewall = IpFirewall;
  }

  $onInit() {
    this.$scope.goBack = this.goBack.bind(this);
    // Hack because the condition in the template wouldn't change depending on the mitigation status
    this.$scope.translations = {};

    this.$scope.toggleFirewall = () => {
      this.$scope.loading = true;

      let newStatus = 'NOT_CONFIGURED';

      if (this.ip.firewall === 'ACTIVATED') {
        newStatus = false;
      } else if (this.ip.firewall === 'DEACTIVATED') {
        newStatus = true;
      }

      if (newStatus === 'NOT_CONFIGURED') {
        this.IpFirewall.addFirewall(this.ipBlock.ipBlock, this.ip.ip)
          .then(() =>
            this.goBack(
              {
                message: {
                  text: this.$translate.instant('ip_firewall_new_success', {
                    t0: this.ip.ip,
                  }),
                  data: 'OK',
                },
              },
              { reload: true },
            ),
          )
          .catch((data) =>
            this.goBack({
              message: {
                text: this.$translate.instant('ip_firewall_new_failed', {
                  t0: this.ip.ip,
                }),
                data: {
                  ...data,
                  type: 'ERROR',
                },
              },
            }),
          );
      } else {
        this.IpFirewall.toggleFirewall(
          this.ipBlock.ipBlock,
          this.ip.ip,
          newStatus,
        )
          .then(() =>
            newStatus
              ? this.goBack(
                  {
                    message: {
                      text: this.$translate.instant(
                        'ip_firewall_enable_success',
                        {
                          t0: this.ip.ip,
                        },
                      ),
                      data: 'OK',
                    },
                  },
                  { reload: true },
                )
              : this.goBack(
                  {
                    message: {
                      text: this.$translate.instant(
                        'ip_firewall_disable_success',
                        {
                          t0: this.ip.ip,
                        },
                      ),
                      data: 'OK',
                    },
                  },
                  { reload: true },
                ),
          )
          .catch((data) =>
            newStatus
              ? this.goBack({
                  message: {
                    text: this.$translate.instant('ip_firewall_enable_failed', {
                      t0: this.ip.ip,
                    }),
                    data: {
                      ...data,
                      type: 'ERROR',
                    },
                  },
                })
              : this.goBack({
                  message: {
                    text: this.$translate.instant(
                      'ip_firewall_disable_failed',
                      {
                        t0: this.ip.ip,
                      },
                    ),
                    data: {
                      ...data,
                      type: 'ERROR',
                    },
                  },
                }),
          );
      }
    };

    this.$scope.cancelAction = () => {
      return this.goBack();
    };

    this.init();
  }

  init() {
    if (this.ip.firewall === 'ACTIVATED') {
      this.$scope.translations.wizardTitle = this.$translate.instant(
        'ip_firewall_disable_title',
      );
      this.$scope.translations.wizardQuestion = this.$translate.instant(
        'ip_firewall_disable_question',
        {
          t0: this.ip.ip,
        },
      );
    } else if (this.ip.firewall === 'DEACTIVATED') {
      this.$scope.translations.wizardTitle = this.$translate.instant(
        'ip_firewall_enable_title',
      );
      this.$scope.translations.wizardQuestion = this.$translate.instant(
        'ip_firewall_enable_question',
        {
          t0: this.ip.ip,
        },
      );
    } else {
      this.$scope.translations.wizardTitle = this.$translate.instant(
        'ip_firewall_new_title',
      );
      this.$scope.translations.wizardQuestion = this.$translate.instant(
        'ip_firewall_new_question',
        {
          t0: this.ip.ip,
        },
      );
    }
  }
}
