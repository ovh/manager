import forEach from 'lodash/forEach';
import pull from 'lodash/pull';

(() => {
  class CloudOfferCtrl {
    constructor(
      $q,
      $stateParams,
      $translate,
      CucFeatureAvailabilityService,
      CloudProjectAdd,
      CucCloudMessage,
      OvhApiMe,
      coreConfig,
      URLS,
    ) {
      this.$q = $q;
      this.$stateParams = $stateParams;
      this.$translate = $translate;
      this.CloudProjectAdd = CloudProjectAdd;
      this.CucCloudMessage = CucCloudMessage;
      this.User = OvhApiMe;
      this.CucFeatureAvailabilityService = CucFeatureAvailabilityService;
      this.region = coreConfig.getRegion();
      this.URLS = URLS;

      this.data = {
        defaultPayment: null,
        agreementsAccepted: [],
        agreements: [],
      };

      this.messages = [];

      this.model = {
        voucher: null,
        projectName: '',
      };

      this.state = {
        allAgreementsAccepted: false,
      };

      this.loaders = {
        payment: false,
        agreements: false,
        start: false,
      };

      this.features = [
        {
          title: 'cloud_offer_vrack',
          explanation: 'cloud_offer_vrack_explanation',
        },
        {
          title: 'cloud_offer_ipfo',
          explanation: 'cloud_offer_ipfo_explanation',
        },
        {
          title: 'cloud_offer_ipv6',
          explanation: 'cloud_offer_ipv6_explanation',
        },
        {
          title: 'cloud_offer_upgrade',
          explanation: 'cloud_offer_upgrade_explanation',
        },
        {
          title: 'cloud_offer_pca',
          explanation: 'cloud_offer_pca_explanation',
        },
        {
          title: 'cloud_offer_snapshot',
          explanation: 'cloud_offer_snapshot_explanation',
        },
        {
          title: 'cloud_offer_ssd',
          explanation: 'cloud_offer_ssd_explanation',
        },
        {
          title: 'cloud_offer_volume',
          explanation: 'cloud_offer_volume_explanation',
        },
        {
          title: 'cloud_offer_object_storage',
          explanation: 'cloud_offer_object_storage_explanation',
        },
        {
          title: 'cloud_offer_api',
          explanation: 'cloud_offer_api_explanation',
        },
      ];

      this.init();
    }

    init() {
      this.loadMessage();
      // Call not available for US customer
      this.CucFeatureAvailabilityService.hasFeaturePromise(
        'PROJECT',
        'expressOrder',
      ).then((hasFeature) => {
        if (!hasFeature) {
          this.loaders.agreements = true;
          this.CloudProjectAdd.getProjectInfo()
            .then((projectInfo) => {
              this.data.agreements = projectInfo.agreementsToAccept;
              this.data.order = projectInfo.orderToPay;
            })
            .finally(() => {
              this.loaders.agreements = false;
            });
          this.getDefaultPaymentMethod();
        }
      });

      this.model.voucher = this.$stateParams.voucher;
    }

    loadMessage() {
      this.CucCloudMessage.unSubscribe('iaas.pci-project-onboarding');
      this.messageHandler = this.CucCloudMessage.subscribe(
        'iaas.pci-project-onboarding',
        { onMessage: () => this.refreshMessage() },
      );
    }

    refreshMessage() {
      this.messages = this.messageHandler.getMessages();
    }

    startProject() {
      this.loaders.start = true;

      // Use express order for US customers
      if (
        this.CucFeatureAvailabilityService.hasFeature('PROJECT', 'expressOrder')
      ) {
        window.location.href = this.URLS.website_order['cloud-resell-eu'].US(
          this.model.projectName,
        );
        return;
      }
      this.acceptAllAgreements().then(() => {
        this.createProject();
      });
    }

    agreementAcceptation(agreementId) {
      if (this.acceptedAgreements[agreementId]) {
        this.data.agreementsAccepted.push(agreementId);
      } else {
        pull(this.data.agreementsAccepted, agreementId);
      }
      this.state.allAgreementsAccepted =
        this.data.agreementsAccepted.length === this.data.agreements.length;
    }

    canStartProject() {
      return this.data.agreements.length && !this.state.allAgreementsAccepted;
    }

    acceptAllAgreements() {
      const agreements = [];
      forEach(this.data.agreements, (agreement) => {
        agreements.push(this.acceptAgreement(agreement.id));
      });
      return this.$q.all(agreements).catch((err) => {
        this.CucCloudMessage.error(
          this.$translate.instant('cpa_error') +
            (err.data && err.data.message ? ` (${err.data.message})` : ''),
        );
        this.loaders.start = false;
      });
    }

    acceptAgreement(agreementId) {
      return this.User.Agreements()
        .v6()
        .accept(
          {
            id: agreementId,
          },
          {},
        );
    }

    getDefaultPaymentMethod() {
      this.loaders.payment = true;
      this.User.PaymentMean()
        .v6()
        .getDefaultPaymentMean()
        .then((defaultPayment) => {
          this.data.defaultPayment = defaultPayment;
        })
        .finally(() => {
          this.loaders.payment = false;
        });
    }

    createProject() {
      this.CloudProjectAdd.startProject(
        this.model.voucher,
        this.model.projectName,
      )
        .catch((error) => {
          if (error.agreements) {
            this.data.agreementsAccepted = [];
            this.data.agreements = error.agreements;
            this.state.allAgreementsAccepted = false;
          }
        })
        .finally(() => {
          this.loaders.start = false;
        });
    }
  }
  angular.module('managerApp').controller('CloudOfferCtrl', CloudOfferCtrl);
})();
