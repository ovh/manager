import forEach from 'lodash/forEach';
import set from 'lodash/set';

/* eslint-disable consistent-return */
(() => {
  class CloudProjectAdd {
    constructor(
      $q,
      $translate,
      $state,
      $window,
      atInternet,
      Toast,
      OvhApiCloud,
      OvhApiMe,
      OvhApiVrack,
      CloudProjectSidebar,
    ) {
      this.$q = $q;
      this.$translate = $translate;
      this.$state = $state;
      this.$window = $window;
      this.atInternet = atInternet;
      this.Toast = Toast;
      this.Cloud = OvhApiCloud;
      this.User = OvhApiMe;
      this.Vrack = OvhApiVrack;
      this.CloudProjectSidebar = CloudProjectSidebar;
    }

    startProject(voucher, description, catalogVersion) {
      // Agreements should be already accepted

      return this.Cloud.v6()
        .createProject(
          {},
          {
            voucher,
            description,
            catalogVersion,
          },
        )
        .$promise.then((response) => {
          let error;
          switch (response.status) {
            case 'creating':
              // User needs to pay something
              this.User.Order()
                .v6()
                .get({
                  orderId: response.orderId,
                })
                .$promise.then((order) => {
                  this.$window.open(order.url, '_blank');
                  this.updateManager(response.project, description);
                  this.atInternet.trackEvent({
                    name: '[PCI]NewProject',
                    page: 'cloud-project::offer',
                    customObject: {
                      voucher,
                    },
                  });
                  this.$state.go('iaas.pci-project.details', {
                    projectId: response.project,
                    fromProjectAdd: true,
                  });
                  this.Toast.success(
                    this.$translate.instant('cpa_success', { url: order.url }),
                  );
                })
                .catch(() => {
                  this.Toast.error(this.$translate.instant('cpa_error'));
                });
              break;
            case 'ok':
              if (response.project) {
                // Success: go to it
                this.updateManager(response.project, description);
                this.$state.go('iaas.pci-project.details', {
                  projectId: response.project,
                  fromProjectAdd: true,
                  createNewVm: true,
                });
              } else {
                // Because it's not normal
                this.Toast.error(this.$translate.instant('cpa_error'));
              }
              break;
            case 'waitingAgreementsValidation':
              error = {
                agreements: this.getAllAgreementsInfo(response.agreements),
              };
              this.Toast.info(
                this.$translate.instant('cpa_error_contracts_tosign'),
              );
              return this.$q.reject(error);
            // case "validationPending":
            default:
          }
        })
        .catch((err) => {
          if (err && err.status) {
            switch (err.status) {
              case 400:
                return this.Toast.error(
                  this.$translate.instant('cpa_error_invalid_paymentmean'),
                );
              case 404:
                return this.Toast.error(
                  this.$translate.instant('cpa_error_invalid_voucher'),
                );
              case 409:
                return this.Toast.error(
                  this.$translate.instant('cpa_error_over_quota'),
                );
              default:
                return this.Toast.error(
                  this.$translate.instant('cpa_error') +
                    (err.data && err.data.message
                      ? ` (${err.data.message})`
                      : ''),
                );
            }
          } else if (err && err.agreements) {
            return this.$q.reject(err);
          }
        });
    }

    getProjectInfo() {
      return this.Cloud.v6()
        .createProjectInfo()
        .$promise.then((response) =>
          this.$q.all({
            agreementsToAccept: this.getAllAgreementsInfo(response.agreements),
            orderToPay: this.$q.when(response.order),
          }),
        )
        .catch((err) => {
          if (err && err.status) {
            switch (err.status) {
              case 409:
                this.Toast.error(
                  this.$translate.instant('cpa_error_over_quota'),
                );
                break;
              default:
                this.Toast.error(
                  this.$translate.instant('cpa_error') +
                    (err.data && err.data.message
                      ? ` (${err.data.message})`
                      : ''),
                );
            }
          }
        });
    }

    getAllAgreementsInfo(agreementsIds) {
      const agreements = [];
      if (agreementsIds && agreementsIds.length) {
        forEach(agreementsIds, (contractId) => {
          agreements.push(this.getContractInfo(contractId));
        });
      }
      return this.$q.all(agreements);
    }

    getContractInfo(contractId) {
      return this.User.Agreements()
        .v6()
        .contract({
          id: contractId,
        })
        .$promise.then((contract) => {
          set(contract, 'id', contractId);
          return contract;
        });
    }

    updateManager(projectId, description) {
      this.CloudProjectSidebar.addToSection({
        project_id: projectId, // jshint ignore:line
        description,
      });
      this.Vrack.v6().resetCache();
      this.Vrack.CloudProject()
        .v6()
        .resetQueryCache();
    }
  }
  angular.module('managerApp').service('CloudProjectAdd', CloudProjectAdd);
})();
/* eslint-enable consistent-return */
