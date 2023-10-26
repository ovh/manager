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
    this.showSpfDiagnosticTitle = false;
  }

  async getSelectorNameForNoOvhCloud() {
    if (!this.dkimSelectorsNoDomain) {
      return;
    }
    const promises = this.dkimSelectorsNoDomain.map((dkimSelector) => {
      return this.services.EmailProDomains.getDkimSelectorName(
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
    this.showSpfDiagnosticTitle = false;
    this.loading = true;
    this.dkimSelectorsNoDomain = await this.getDkimSelectorForCurrentState();
    await this.stepConfigureDkimFor('emailpro');
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

  stepConfigureDkimFor(targetService) {
    const promises = this.postDkimFor(this.dkimSelectorsNoDomain);
    return this.services.$q
      .all(promises)
      .then(() => {
        this.services.messaging.writeSuccess(
          this.services.$translate.instant(
            `${targetService}_tab_domain_diagnostic_dkim_activation_success`,
          ),
        );
      })
      .catch(() => {
        this.leaveDkimConfigurator();
        this.services.messaging.writeError(
          this.services.$translate.instant(
            `${targetService}_tab_domain_diagnostic_dkim_configurate_no_ovhcloud_failed`,
          ),
        );
      });
  }

  getTitleDependingOnStepFor(targetService) {
    return !this.showSpfDiagnosticTitle
      ? `${targetService}emailpro_tab_domain_diagnostic_dkim_title_configuration`
      : `${targetService}emailpro_tab_domain_diagnostic_spf_title`;
  }

  getNextButtonDependingOnStepFor(targetService) {
    return this.showConfiguratingBtn
      ? `${targetService}emailpro_tab_domain_diagnostic_dkim_configurate_no_ovhcloud`
      : `${targetService}emailpro_tab_domain_diagnostic_dkim_next_no_ovhcloud`;
  }

  initSpfContext() {
    this.showSpfDiagnosticTitle = true;
    return this.getSelectorNameForNoOvhCloud();
  }

  getDkimNameFor(targetService, index) {
    return [
      this.services.$translate.instant(
        `${targetService}_tab_domain_diagnostic_dkim_name`,
      ),
      `${index}: `,
      this[`selector${index}NoDomain`].customerRecord,
    ].join('');
  }

  getDkimRecordFor(targetService, index) {
    return [
      this.services.$translate.instant(
        `${targetService}_tab_domain_diagnostic_dkim_record`,
      ),
      `${index}: `,
      this[`selector${index}NoDomain`].targetRecord,
    ].join('');
  }

  hideConfirmButton() {
    return (
      this.dkimStatus === this.GLOBAL_DKIM_STATUS.NOT_CONFIGURED &&
      this.domainDiag.isOvhDomain
    );
  }
}
