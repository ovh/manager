export default function /* @ngInject */ (userAccountServiceInfos, Alerter, $translate) {
  this.isLoadingDeveloperMode = false;

  this.beta = {
    active: this.betaFlag,
  };

  this.$ngInit = () => {
    this.isLoadingDeveloperMode = true;
    userAccountServiceInfos
      .getDeveloperMode()
      .then((developmentMode) => {
        this.developmentMode = developmentMode;
      })
      .finally(() => {
        this.isLoadingDeveloperMode = false;
      });
  };

  this.updateDevelopmentMode = () => {
    this.isLoadingDeveloperMode = true;
    const successKey = this.developmentMode.enabled ? 'user_account_advanced_section_developer_alert_success_enabled' : 'user_account_advanced_section_developer_alert_success_disabled';
    userAccountServiceInfos
      .updateDeveloperMode(this.developmentMode)
      .then(() => {
        const zone = 'useraccount.alerts.dashboardAdvanced';
        return Alerter.success($translate.instant(successKey), zone);
      }, () => {
        const zone = 'useraccount.alerts.dashboardAdvanced';
        return Alerter.error($translate.instant('user_account_advanced_section_developer_alert_error'), zone);
      })
      .finally(() => {
        this.isLoadingDeveloperMode = false;
      });
  };

  this.onBetaChange = (beta) => {
    this.isUpdatingBeta = true;
    this.updateBeta(beta)
      .then(() => {
        this.beta.active = beta;
        Alerter.success($translate.instant('user_account_advanced_section_beta_success'), 'useraccount.alerts.dashboardAdvanced');
      })
      .catch(() => Alerter.error($translate.instant('user_account_advanced_section_beta_error'), 'useraccount.alerts.dashboardAdvanced'))
      .finally(() => {
        this.isUpdatingBeta = false;
      });
  };

  this.$ngInit();
}
