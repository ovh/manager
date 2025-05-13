import isEmpty from 'lodash/isEmpty';
import isObject from 'lodash/isObject';

angular.module('App').controller(
  'hostingOrderSslCtrl',
  class HostingOrderSslCtrl {
    /* @ngInject */
    constructor(
      $q,
      $scope,
      $stateParams,
      $translate,
      $window,
      Alerter,
      Hosting,
      HOSTING,
      HostingDomain,
      hostingSSLCertificate,
      hostingSSLCertificateType,
      WucUser,
      WucValidator,
    ) {
      this.$q = $q;
      this.$scope = $scope;
      this.$stateParams = $stateParams;
      this.$translate = $translate;

      this.Alerter = Alerter;
      this.Hosting = Hosting;
      this.HOSTING = HOSTING;
      this.HostingDomain = HostingDomain;
      this.hostingSSLCertificate = hostingSSLCertificate;
      this.hostingSSLCertificateType = hostingSSLCertificateType;
      this.WucUser = WucUser;
      this.WucValidator = WucValidator;
      this.$window = $window;
    }

    $onInit() {
      this.certificateTypes = this.hostingSSLCertificateType.constructor.getCertificateTypes();
      this.selectedCertificateType = this.certificateTypes.LETS_ENCRYPT.name;
      this.serviceName = this.$stateParams.productId;

      this.step1 = {
        loading: {
          isRetrievingInitialData: true,
        },
        canOrderLetEncryptCertificate: true,
        sslCharLimitExceeded: false,
      };

      this.step2 = {
        loading: {
          isGeneratingOrderForm: false,
        },
        importedCertificate: {},
      };

      if (
        !this.WucValidator.isValidLetsEncryptDomain(
          'www.',
          this.$stateParams.productId,
        )
      ) {
        this.selectedCertificateType = this.certificateTypes.IMPORTED.name;
        this.step1.canOrderLetEncryptCertificate = false;
        this.step1.sslCharLimitExceeded = true;
      }

      this.$scope.onStep1Load = () => this.onStep1Load();
      this.$scope.onStep1NextStep = () => this.onStep1NextStep();
      this.$scope.onStep2Load = () => this.onStep2Load();
      this.$scope.onFinishWizard = () => this.onFinishWizard();
    }

    onStep1Load() {
      this.step1.loading.isRetrievingInitialData = true;

      return this.HostingDomain.getDetailedAttachedDomains(this.serviceName)
        .then((domains) => {
          this.availableDomains = domains.filter(
            ({ domain }) => domain !== this.serviceName,
          );
        })
        .then(() => this.Hosting.getSelected(this.$stateParams.productId))
        .then((hosting) => {
          this.step1.canOrderPaidCertificate =
            hosting.offer !== this.HOSTING.offers.START_10_M &&
            !isEmpty(this.availableDomains);
        })
        .catch((err) => {
          this.step1.cannotOrderPaidCertificateErrorMessage = this.$translate.instant(
            'hosting_dashboard_ssl_paid_certificate_error',
            { t0: err.message },
          );
          this.step1.canOrderPaidCertificate = false;
        })
        .then(() =>
          this.hostingSSLCertificate
            .retrievingCertificate(this.$stateParams.productId)
            .then((certificate) => {
              if (
                certificate.provider ===
                this.certificateTypes.LETS_ENCRYPT.providerName
              ) {
                this.selectedCertificateType = this.certificateTypes.IMPORTED.name;
                this.step1.canOrderLetEncryptCertificate = false;
              }
            }),
        )
        .finally(() => {
          this.step1.loading.isRetrievingInitialData = false;
        });
    }

    onStep1NextStep() {
      if (
        this.hostingSSLCertificateType.constructor.isLetsEncrypt(
          this.selectedCertificateType,
        )
      ) {
        return this.creatingCertificate();
      }

      if (
        this.hostingSSLCertificateType.constructor.isPaid(
          this.selectedCertificateType,
        ) &&
        !this.selectedDomain.ssl
      ) {
        return this.HostingDomain.updateAttachedDomain(
          this.serviceName,
          this.selectedDomain.domain,
          {
            ssl: true,
          },
        );
      }

      return this.$q.resolve();
    }

    onStep2Load() {
      if (
        this.hostingSSLCertificateType.constructor.isPaid(
          this.selectedCertificateType,
        )
      ) {
        this.generatingOrderForm();
      }
    }

    isStep2Valid() {
      const isPaidCertificateValid =
        this.hostingSSLCertificateType.constructor.isPaid(
          this.selectedCertificateType,
        ) && !this.step2.loading.isGeneratingOrderForm;
      const isImportCertificateValid =
        this.hostingSSLCertificateType.constructor.isImported(
          this.selectedCertificateType,
        ) &&
        isObject(this.importCertificateForm) &&
        this.importCertificateForm.$valid;

      return isPaidCertificateValid || isImportCertificateValid;
    }

    creatingCertificate() {
      return this.hostingSSLCertificate
        .creatingCertificate(
          this.$stateParams.productId,
          this.step2.importedCertificate.content,
          this.step2.importedCertificate.key,
          this.step2.importedCertificate.chain,
        )
        .then(() => {
          this.hostingSSLCertificate.reload();
          this.Alerter.success(
            this.$translate.instant('hosting_dashboard_ssl_generate_success'),
            this.$scope.alerts.main,
          );
        })
        .catch((err) => {
          this.Alerter.alertFromSWS(
            this.$translate.instant('hosting_dashboard_ssl_order_error'),
            err.data,
            this.$scope.alerts.main,
          );
        })
        .finally(() => {
          this.$scope.resetAction();
        });
    }

    generatingOrderForm() {
      this.step2.loading.isGeneratingOrderForm = true;

      return this.WucUser.getUrlOfEndsWithSubsidiary(
        'domain_order_options_service',
      )
        .then((rawOrderFormURL) => {
          this.orderFormURL = rawOrderFormURL
            .replace('{serviceName}', this.serviceName)
            .replace('{domainName}', this.selectedDomain.domain);
        })
        .catch((err) => {
          this.Alerter.alertFromSWS(
            this.$translate.instant(
              'hosting_dashboard_ssl_redirect_to_order_error',
            ),
            err,
            this.$scope.alerts.main,
          );
          this.$scope.resetAction();
        })
        .finally(() => {
          this.step2.loading.isGeneratingOrderForm = false;
        });
    }

    onFinishWizard() {
      if (
        this.hostingSSLCertificateType.constructor.isPaid(
          this.selectedCertificateType,
        )
      ) {
        this.$window.open(this.orderFormURL, '_blank');
        this.$scope.resetAction();
      } else if (
        this.hostingSSLCertificateType.constructor.isImported(
          this.selectedCertificateType,
        )
      ) {
        this.creatingCertificate();
      }
    }
  },
);
