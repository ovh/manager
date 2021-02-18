import find from 'lodash/find';
import keyBy from 'lodash/keyBy';
import remove from 'lodash/remove';
import set from 'lodash/set';

import { buildURL } from '@ovh-ux/ufrontend/url-builder';

angular
  .module('managerApp')
  .controller('CloudProjectAddCtrl', function CloudProjectAddCtrl(
    $q,
    $state,
    $translate,
    atInternet,
    Toast,
    CucFeatureAvailabilityService,
    OvhApiCloud,
    OvhApiMe,
    OvhApiVrack,
    $window,
    OvhApiMePaymentMeanCreditCard,
    CloudProjectSidebar,
    CloudProjectAdd,
  ) {
    const self = this;

    this.loaders = {
      init: true,
      creating: false,
    };

    this.data = {
      projectsCount: 0,
      status: null, // project creation status
      agreements: [], // contracts agreements
      defaultPaymentMean: null,
      projectPrice: null, // price for creating a new project with BC
      availablePaymentMeans: {
        // list of available payment means
        creditCard: false,
        bankAccount: false,
        paypal: false,
      },
      hasDebt: false, // true if user has debt (fidelity account balance < 0)
      hasBill: false, // true if user has at least one bill
    };

    this.model = {
      description: '', // new project name
      contractsAccepted: false,
      voucher: null,
      paymentMethod: null, // user choosen payment method (either MEAN or BC)
      noPaymentMethodEnum: keyBy(['MEAN', 'BC']),
      catalogVersion: null, //  null == latest 1 === old catalog
    };

    // PaymentMean URL (v6 dedicated) with sessionv6
    this.paymentmeanUrl = buildURL('dedicated', '#/billing/mean');
    // Add credit card URL
    this.addCreditCardUrl = buildURL('dedicated', '#/billing/mean/add', {
      meanType: 'creditCard',
    });

    function updateManager(projectId) {
      CloudProjectSidebar.addToSection({
        project_id: projectId, // jshint ignore:line
        description: self.model.description,
      });
      OvhApiVrack.v6().resetCache();
      OvhApiVrack.CloudProject()
        .v6()
        .resetQueryCache();
    }

    /**
     * Launch project creation process
     */
    this.createProject = function createProject() {
      atInternet.trackClick({
        name: 'pci-project_new-project-create',
        type: 'action',
      });

      let promiseContracts = true;
      const queue = [];
      self.loaders.creating = true;

      // If contracts: accept them
      if (self.model.contractsAccepted && self.data.agreements.length) {
        const queueContracts = [];
        angular.forEach(self.data.agreements, (contract) => {
          queueContracts.push(
            OvhApiMe.Agreements()
              .v6()
              .accept(
                {
                  id: contract.id,
                },
                {},
              )
              .$promise.then(() => {
                remove(self.data.agreements, {
                  id: contract.id,
                });
              }),
          );
        });
        promiseContracts = $q.all(queueContracts);
      }

      return $q
        .when(promiseContracts)
        .then(() =>
          OvhApiCloud.v6()
            .createProject(
              {},
              {
                voucher: self.model.voucher || undefined,
                description: self.model.description || undefined,
                catalogVersion: self.model.catalogVersion || undefined,
              },
            )
            .$promise.then((response) => {
              self.data.status = response.status;

              switch (response.status) {
                case 'creating':
                  OvhApiMe.Order()
                    .v6()
                    .get({
                      orderId: response.orderId,
                    })
                    .$promise.then(
                      (order) => {
                        $window.open(order.url, '_blank');
                        updateManager(response.project);
                        $state.go('iaas.pci-project.details', {
                          projectId: response.project,
                          fromProjectAdd: true,
                        });
                        return Toast.success(
                          $translate.instant('cpa_success', { url: order.url }),
                        );
                      },
                      () => Toast.error($translate.instant('cpa_error')),
                    );
                  break;
                case 'ok':
                  if (response.project) {
                    // Success: go to it
                    updateManager(response.project);
                    return $state.go('iaas.pci-project.details', {
                      projectId: response.project,
                      fromProjectAdd: true,
                    });
                  }
                  // Because it's not normal
                  return Toast.error($translate.instant('cpa_error'));
                case 'waitingAgreementsValidation':
                  self.data.agreements = [];
                  // Get all contracts
                  if (response.agreements && response.agreements.length) {
                    angular.forEach(response.agreements, (contractId) => {
                      queue.push(
                        OvhApiMe.Agreements()
                          .v6()
                          .contract({
                            id: contractId,
                          })
                          .$promise.then((contract) => {
                            set(contract, 'id', contractId);
                            self.data.agreements.push(contract);
                          }),
                      );
                    });
                  }

                  // for multi-project: say to user that there are contracts to sign
                  if (!self.loaders.init) {
                    Toast.info(
                      $translate.instant('cpa_error_contracts_tosign'),
                    );
                  }

                  return $q.all(queue);

                // case "validationPending":
                default:
                  return null;
              }

              return null;
            }),
        )
        .catch((err) => {
          if (err && err.status) {
            switch (err.status) {
              case 400:
                return Toast.error(
                  $translate.instant('cpa_error_invalid_paymentmean'),
                );
              case 409:
                return Toast.error($translate.instant('cpa_error_over_quota'));
              default:
                return Toast.error(
                  $translate.instant('cpa_error') +
                    (err.data && err.data.message
                      ? ` (${err.data.message})`
                      : ''),
                );
            }
          }
          return null;
        })
        .finally(() => {
          self.loaders.creating = false;
        });
    };

    // returns true if user has at least one bill and no debt
    this.isTrustedUser = function isTrustedUser() {
      return (
        this.has3dsCreditCard() || (self.data.hasBill && !self.data.hasDebt)
      );
    };

    // returns true if user has at least one 3D secure registered credit card
    this.has3dsCreditCard = function has3dsCreditCard() {
      return angular.isDefined(find(self.data.creditCards, 'threeDsValidated'));
    };

    this.canCreateProject = function canCreateProject() {
      let canCreate = false;
      if (self.model.voucher) {
        canCreate = true;
      } else if (
        self.model.paymentMethod === self.model.noPaymentMethodEnum.BC
      ) {
        canCreate = true;
      } else if (this.isTrustedUser()) {
        canCreate = angular.isDefined(self.data.defaultPaymentMean);
      }
      return canCreate;
    };

    this.paymentRegister = function paymentRegister() {
      atInternet.trackClick({
        name: 'pci-project_payment-means-register',
        type: 'action',
      });
      $window.open(this.paymentmeanUrl, '_blank');
    };

    function initUserFidelityAccount() {
      return OvhApiMe.FidelityAccount()
        .v6()
        .get()
        .$promise.then(
          (account) => $q.when(account),
          (err) => (err && err.status === 404 ? $q.when(null) : $q.reject(err)),
        );
    }

    function initContracts() {
      return CloudProjectAdd.getProjectInfo().then((projectInfo) => {
        self.data.agreements = projectInfo.agreementsToAccept;
      });
    }

    function initProject() {
      return $q
        .all({
          projectIds: OvhApiCloud.Project()
            .v6()
            .query().$promise,
          price: OvhApiCloud.Price()
            .v6()
            .query().$promise,
          user: OvhApiMe.v6().get().$promise,
          defaultPayment: OvhApiMe.PaymentMean()
            .v6()
            .getDefaultPaymentMean(),
          availablePayment: OvhApiMe.AvailableAutomaticPaymentMeans()
            .v6()
            .get().$promise,
          fidelityAccount: initUserFidelityAccount(),
          bill: OvhApiMe.Bill()
            .v6()
            .query().$promise,
          creditCards: OvhApiMePaymentMeanCreditCard.v6().getCreditCards(),
        })
        .then((result) => {
          self.data.projectsCount = result.projectIds.length;
          self.data.projectPrice = result.price.projectCreation;
          self.data.defaultPaymentMean = result.defaultPayment;
          self.data.availablePaymentMeans = result.availablePayment;
          self.data.hasDebt =
            result.fidelityAccount && result.fidelityAccount.balance < 0;
          self.data.hasBill = result.bill.length > 0;
          self.data.creditCards = result.creditCards;
          self.model.description = $translate.instant(
            'cloud_menu_project_num',
            { num: self.data.projectsCount + 1 },
          );
          self.model.paymentMethod = self.model.noPaymentMethodEnum.MEAN;
        });
    }

    function init() {
      self.loaders.init = true;
      // Redirect US to onboarding
      if (CucFeatureAvailabilityService.hasFeature('PROJECT', 'expressOrder')) {
        $state.go('iaas.pci-project-onboarding', { location: 'replace' });
        return;
      }
      initContracts()
        .then(initProject)
        .catch((err) => {
          self.unknownError = true;
          Toast.error(
            $translate.instant('cpa_error') +
              (err && err.data && err.data.message
                ? ` (${err.data.message})`
                : ''),
          );
        })
        .finally(() => {
          self.loaders.init = false;
        });
    }

    init();
  });
