/**
 * DkimAutoConfigurator is the core logic used for modals stepper (no ovh cloud domain)
 */
export default class DkimAutoConfigurator {
  initializeDkimConfiguratorNoOvh() {
    this.selector1NameInfos = '';
    this.selector1RecordInfos = '';
    this.selector2NameInfos = '';
    this.selector2RecordInfos = '';
    this.dkimSelectorsNoDomain = null;
    this.selector1NoDomain = null;
    this.selector2NoDomain = null;
    this.isStepConfigureValid = false;
    this.showConfiguratingBtn = true;
  }

  async getSelectorNameForNoOvhCloud() {
    if (!this.dkimSelectorsNoDomain) {
      return;
    }
    const promises = this.dkimSelectorsNoDomain.map((dkimSelector) => {
      return this.services.ExchangeDomains.getDkimSelectorName(
        this.$routerParams.organization,
        this.$routerParams.productId,
        this.domain.name,
        dkimSelector,
      );
    });

    const [selector1NoDomain, selector2NoDomain] = await this.services.$q.all(
      promises,
    );
    this.selector1NoDomain = selector1NoDomain;
    this.selector1NameInfos = this.getDkimName(1);
    this.selector1RecordInfos = this.getDkimRecord(1);
    this.selector2NoDomain = selector2NoDomain;
    this.selector2NameInfos = this.getDkimName(2);
    this.selector2RecordInfos = this.getDkimRecord(2);
  }

  async loadDataForDkim() {
    this.showConfiguratingBtn = false;
    this.loading = true;
    this.dkimSelectorsNoDomain = await this.getDkimSelectorForCurrentState();
    await this.configureDkim();
    this.isStepConfigureValid = true;
    this.loading = false;
  }

  getDkimSelector() {
    return this.getDkimSelectorForCurrentState().then((dkimSelectors) => {
      this.dkimSelectorsNoDomain = dkimSelectors;
    });
  }

  leaveDkimConfigurator() {
    this.services.navigation.resetAction();
    return this.initializeDkimConfiguratorNoOvh();
  }

  configureDkim() {
    const promises = this.postDkim(this.dkimSelectorsNoDomain);
    return this.services.$q
      .all(promises)
      .then(() => {
        this.services.messaging.writeSuccess(
          this.services.$translate.instant(
            `${this.serviceType}_tab_domain_diagnostic_dkim_activation_success`,
          ),
        );
      })
      .catch(() => {
        this.leaveDkimConfigurator();
        this.services.messaging.writeError(
          this.services.$translate.instant(
            `${this.serviceType}_tab_domain_diagnostic_dkim_configurate_no_ovhcloud_failed`,
          ),
        );
      });
  }

  getTitleDkimConfigurator() {
    return `${this.serviceType}_tab_domain_diagnostic_dkim_title_configuration`;
  }

  getNextButtonDependingOnStep() {
    return this.showConfiguratingBtn
      ? `${this.serviceType}_tab_domain_diagnostic_dkim_configurate_no_ovhcloud`
      : `${this.serviceType}_tab_domain_diagnostic_dkim_next_no_ovhcloud`;
  }

  initContext() {
    return this.getSelectorNameForNoOvhCloud();
  }

  getDkimName(index) {
    return [
      `<b>${this.services.$translate.instant(
        `${this.serviceType}_tab_domain_diagnostic_dkim_name`,
      )}`,
      `${index}</b>: `,
      this[`selector${index}NoDomain`].customerRecord,
    ].join('');
  }

  getDkimRecord(index) {
    return [
      `<b>${this.services.$translate.instant(
        `${this.serviceType}_tab_domain_diagnostic_dkim_target`,
      )}`,
      `${index}</b>: `,
      this[`selector${index}NoDomain`].targetRecord,
    ].join('');
  }

  hideConfirmButton() {
    return (
      this.dkimStatus === this.DKIM_STATUS.TO_CONFIGURE &&
      this.domainDiag.isOvhDomain
    );
  }
}
