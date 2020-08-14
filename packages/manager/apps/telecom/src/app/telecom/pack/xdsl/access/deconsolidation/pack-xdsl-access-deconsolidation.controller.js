angular
  .module('managerApp')
  .controller('XdslDeconsolidationCtrl', function XdslDeconsolidationCtrl(
    $scope,
    $state,
    $timeout,
    $translate,
    OvhApiXdsl,
    TucToast,
    $uibModal,
    TucToastError,
    REDIRECT_URLS,
    OvhApiPackXdsl,
    tucValidator,
    $stateParams,
  ) {
    const self = this;

    this.isLegacyOffer = null;
    this.model = {
      validDeconso: false,
      rio: null,
    };
    this.rioCodeIsValid = false;

    this.openConfirmModal = function openConfirmModal() {
      const modal = $uibModal.open({
        animation: true,
        templateUrl:
          'app/telecom/pack/xdsl/access/deconsolidation/contract/pack-xdsl-access-deconsolidation-contract.modal.html',
        controller: 'XdslDeconsolidationContractCtrl',
        controllerAs: 'XdslDeconsolidationContract',
        resolve: {
          data() {
            return {
              rio: self.model.rio,
              serviceName: $scope.access.xdsl.accessName,
            };
          },
        },
      });
      modal.result.then((result) => {
        if (result.status === 'todo' || result.status === 'doing') {
          $scope.access.tasks.current[result.function] = true;
        }
        TucToast.success(
          $translate.instant('xdsl_access_deconsolidation_success'),
        );
        $timeout(() => {
          $state.go('telecom.packs.pack.xdsl.line');
        }, 3000);
      });
    };

    this.getOldV6TransfertUrl = function getOldV6TransfertUrl() {
      return REDIRECT_URLS.oldV6ServiceTransfert;
    };

    this.checkRioCode = function checkRioCode() {
      this.rioCodeIsValid = tucValidator.tucIsRio(
        self.model.rio,
        $stateParams.number,
      );
    };

    function updateIsLegacyOffer() {
      return OvhApiPackXdsl.v6()
        .get({
          packId: $stateParams.packName,
        })
        .$promise.then((data) => {
          self.isLegacyOffer = data.capabilities.isLegacyOffer;
        }, TucToastError);
    }

    function init() {
      self.loading = true;
      updateIsLegacyOffer().finally(() => {
        self.loading = false;
      });
    }

    init();
  });
