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

  getSelectorNameForNoOvhCloud() {
    if (!this.dkimSelectorsNoDomain) {
      return false;
    }
    this.loading = true;
    const promises = this.dkimSelectorsNoDomain.map((dkimSelector) => {
      return this.services.EmailProDomains.getDkimSelectorName(
        this.services.$stateParams.productId,
        this.domain.name,
        dkimSelector,
      );
    });

    return this.services.$q
      .all(promises)
      .then((data) => {
        const [selector1NoDomain, selector2NoDomain] = data;
        this.selector1NoDomain = selector1NoDomain;
        this.selector1NameInfos = this.getDkimName(1);
        this.selector1RecordInfos = this.getDkimRecord(1);
        this.selector2NoDomain = selector2NoDomain;
        this.selector2NameInfos = this.getDkimName(2);
        this.selector2RecordInfos = this.getDkimRecord(2);
        this.loading = false;
        return data;
      })
      .catch(() => []);
  }

  async loadDataForDkim() {
    this.showConfiguratingBtn = false;
    this.loading = true;
    if (!this.isMXPlan) {
      this.dkimSelectorsNoDomain = await this.getDkimSelectorForCurrentState();
    }
    this.configureDkim().then(() => {
      if (!this.isMXPlan) {
        return this.activationSelectorsStatus();
      }
      this.isStepConfigureValid = true;
      this.loading = false;
      return null;
    });
  }

  getDkimSelector() {
    return this.isMXPlan
      ? null
      : this.getDkimSelectorForCurrentState()
          .then((dkimSelectors) => {
            this.dkimSelectorsNoDomain = dkimSelectors;
          })
          .catch(({ data }) => {
            this.writeError('emailpro_tab_domain_diagnostic_dkim_error', data);
          });
  }

  leaveDkimConfigurator(reload = false) {
    this.services.$scope.resetAction();
    this.initializeDkimConfiguratorNoOvh();
    this.services.$state.go(
      this.services.$state.current.name,
      { productId: this.services.$stateParams.productId },
      reload ? { reload: this.services.$state.current.name } : null,
    );
  }

  configureDkim() {
    if (!this.isMXPlan || this.dkimMXplanSelectors.length === 0) {
      const promises =
        this.isMXPlan && this.dkimMXplanSelectors.length === 0
          ? this.services.EmailProDomains.enableDkimForMXplan(this.domain.name)
          : this.postDkim(this.dkimSelectorsNoDomain);
      return this.services.$q.all(promises).catch(({ data }) => {
        this.leaveDkimConfigurator();
        return this.writeError(
          `${this.serviceType}_tab_domain_diagnostic_dkim_error`,
          data,
        );
      });
    }
    return this.services.$q.resolve();
  }

  activationSelectorsStatus() {
    if (
      this.dkimSelectorsNoDomain &&
      (!this.selector1NoDomain || !this.selector2NoDomain)
    ) {
      setTimeout(async () => {
        await this.getSelectorNameForNoOvhCloud();
        return this.activationSelectorsStatus();
      }, 5000);
      return false;
    }
    this.isStepConfigureValid = true;
    return this.services.$q.resolve();
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
    if (this.isMXPlan) {
      this.selector1NoDomain = {
        customerRecord: this.dkimMXplanSelectors[0].selectorName,
        targetRecord: this.dkimMXplanSelectors[0].cname,
      };
      this.selector1RecordInfos = this.getDkimRecord(1);
      this.selector2NoDomain = {
        customerRecord: this.dkimMXplanSelectors[1].selectorName,
        targetRecord: this.dkimMXplanSelectors[1].cname,
      };
      this.selector2RecordInfos = this.getDkimRecord(2);
    } else {
      this.getSelectorNameForNoOvhCloud();
    }
  }

  getDkimName(index) {
    return [
      `<b>${this.services.$translate.instant(
        `${this.serviceType}_tab_domain_diagnostic_dkim_subdomain`,
        { value: index },
      )}</b>: `,
      this[`selector${index}NoDomain`].customerRecord,
    ].join('');
  }

  getDkimRecord(index) {
    return [
      `<b>${this.services.$translate.instant(
        `${this.serviceType}_tab_domain_diagnostic_dkim_${
          this.isMXPlan ? 'cname' : 'target'
        }`,
        { value: index },
      )}</b>: `,
      this[`selector${index}NoDomain`].targetRecord,
    ].join('');
  }

  hideConfirmButton() {
    return (
      (!this.isMXPlan &&
        ([this.DKIM_STATUS.TO_CONFIGURE, this.DKIM_STATUS.IN_PROGRESS].includes(
          this.dkimStatus,
        ) ||
          this.dkimErrorMessage)) ||
      (this.isMXPlan && [this.DKIM_STATUS.MODIFYING].includes(this.dkimStatus))
    );
  }

  writeError(message, params) {
    this.writeMessage(message, 'error', params);
  }

  writeSuccess(message, params) {
    this.writeMessage(message, 'success', params);
  }

  writeMessage(message, type, params) {
    const translation = this.services.$translate.instant(message, params);
    this.services.$scope.setMessage(translation, {
      type,
    });
  }
}
