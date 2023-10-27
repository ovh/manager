import { DKIM_CONFIGURATION_GUIDE } from './emailpro-domain-dkim-autoconfig.constants';

export default class EmailProDomainDkimAutoconfigCtrl {
  /* @ngInject */
  constructor(
    $q,
    $scope,
    $stateParams,
    $translate,
    coreConfig,
    EmailPro,
    EmailProDomains,
  ) {
    this.services = {
      $q,
      $scope,
      $stateParams,
      $translate,
      EmailPro,
      EmailProDomains,
    };

    this.domain = $scope.currentActionData.domain;
    this.dkimStatus = $scope.currentActionData.dkimStatus;
    this.GLOBAL_DKIM_STATUS =
      $scope.currentActionData.constant.GLOBAL_DKIM_STATUS;
    this.services.$scope.configDkim = () => this.configDkim();

    this.dkimGuideLink =
      DKIM_CONFIGURATION_GUIDE[coreConfig.getUser().ovhSubsidiary] ||
      DKIM_CONFIGURATION_GUIDE.DEFAULT;

    this.init();
  }

  init() {
    this.loading = true;
    this.services.EmailProDomains.getDnsSettings(
      this.services.$stateParams.productId,
      this.domain.name,
    )
      .then(
        (data) => {
          this.domainDiag = data;
          this.hideConfirmButton = this.hideConfirmButton();

          this.dkimForNoOvhCloud =
            this.dkimStatus === this.GLOBAL_DKIM_STATUS.NOT_CONFIGURED &&
            !this.domainDiag.isOvhDomain;

          this.loading = false;
        },
        (failure) => {
          this.services.$scope.resetAction();
          this.services.$scope.setMessage(
            this.services.$translate.instant(
              'emailpro_tab_domain_diagnostic_add_field_failure',
            ),
            failure,
          );
        },
      )
      .finally(() => {
        this.loading.step1 = false;
      });
  }

  hideConfirmButton() {
    return (
      this.dkimStatus === this.GLOBAL_DKIM_STATUS.NOT_CONFIGURED &&
      this.domainDiag.isOvhDomain
    );
  }

  configDkim() {
    this.services.EmailProDomains.getDkimSelector(
      this.services.$stateParams.productId,
      this.domain.name,
    )
      .then((dkimSelectors) => {
        const promises = dkimSelectors.map((dkimSelector, index) => {
          return this.services.EmailProDomains.postDkim(
            this.services.$stateParams.productId,
            this.domain.name,
            {
              selectorName: dkimSelector,
              autoEnableDKIM: index === 0,
              configureDkim: !this.dkimForNoOvhCloud,
            },
          );
        });
        return this.services.$q.all(promises);
      })
      .then(() => {
        this.services.$scope.setMessage(
          this.services.$translate.instant(
            'emailpro_tab_domain_diagnostic_dkim_activation_success',
          ),
          { status: 'success' },
        );
      })
      .catch(() => {
        this.services.$scope.setMessage(
          this.services.$translate.instant(
            'emailpro_tab_domain_diagnostic_dkim_activation_error',
          ),
          { status: 'error' },
        );
      })
      .finally(() => {
        this.services.$scope.resetAction();
      });
  }
}
