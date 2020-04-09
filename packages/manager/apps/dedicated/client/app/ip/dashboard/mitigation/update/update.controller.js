export default class {
  /* @ngInject */
  constructor($scope, $translate, Ip, IpDashboardMitigation) {
    this.$scope = $scope;
    this.$translate = $translate;
    this.Ip = Ip;
    this.IpDashboardMitigation = IpDashboardMitigation;
  }

  $onInit() {
    this.$scope.translations = {};

    this.$scope.updateMitigation = () => {
      this.$scope.loading = true;

      // Toggle between the two mitigation status that can be changed
      let newMitigationStatus = 'DEFAULT';
      if (this.$scope.mitigationStatusAuto) {
        newMitigationStatus = 'PERMANENT';
      }

      this.IpDashboardMitigation.updateMitigation(
        this.ipBlock.ipBlock,
        this.ip.ip,
        newMitigationStatus,
      )
        .then((data) =>
          newMitigationStatus === 'DEFAULT'
            ? this.goBack(
                {
                  message: {
                    text: this.$translate.instant(
                      'ip_mitigation_auto_success',
                      {
                        t0: this.ip.ip,
                      },
                    ),
                    data: {
                      ...data,
                      type: 'OK',
                    },
                  },
                },
                { reload: true },
              )
            : this.goBack(
                {
                  message: {
                    text: this.$translate.instant(
                      'ip_mitigation_permanent_success',
                      {
                        t0: this.ip.ip,
                      },
                    ),
                    data: {
                      ...data,
                      type: 'OK',
                    },
                  },
                },
                { reload: true },
              ),
        )
        .catch((data) =>
          newMitigationStatus === 'DEFAULT'
            ? this.goBack({
                message: {
                  text: this.$translate.instant('ip_mitigation_auto_failed', {
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
                    'ip_mitigation_permanent_failed',
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
    };

    this.$scope.cancelAction = () => this.goBack();

    return this.init();
  }

  init() {
    this.$scope.mitigationStatusAuto =
      !this.ip.mitigation || this.ip.mitigation === 'DEFAULT'; // Hack for the wizard status

    // Hack because the condition in the template wouldn't change depending on the mitigation status
    if (this.$scope.mitigationStatusAuto) {
      this.$scope.translations.wizardTitle = this.$translate.instant(
        'ip_mitigation_permanent_title',
      );
      this.$scope.translations.wizardQuestion = this.$translate.instant(
        'ip_mitigation_permanent_question',
        {
          t0: this.ip.ip,
        },
      );
    } else {
      this.$scope.translations.wizardTitle = this.$translate.instant(
        'ip_mitigation_auto_title',
      );
      this.$scope.translations.wizardQuestion = this.$translate.instant(
        'ip_mitigation_auto_question',
        {
          t0: this.ip.ip,
        },
      );
    }
  }
}
