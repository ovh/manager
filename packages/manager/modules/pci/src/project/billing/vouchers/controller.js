import addVoucherController from './addVoucher/controller';
import addVoucherTemplate from './addVoucher/template.html';

import addCreditController from './addCredit/controller';
import addCreditTemplate from './addCredit/template.html';

export default class CloudprojectbillingvouchersCtrl {
  /* @ngInject */
  constructor(
    $q,
    $stateParams,
    $translate,
    CucCloudMessage,
    $uibModal,
    OvhApiMeBill,
    CucControllerHelper,
    CloudVouchersService,
    CucServiceHelper,
    OvhApiOrderCloudProjectCredit,
  ) {
    this.$q = $q;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.$uibModal = $uibModal;
    this.OvhApiMeBill = OvhApiMeBill;
    this.CucControllerHelper = CucControllerHelper;
    this.CloudVouchersService = CloudVouchersService;
    this.CucServiceHelper = CucServiceHelper;
    this.OvhApiOrderCloudProjectCredit = OvhApiOrderCloudProjectCredit;

    this.vouchers = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () => this.CloudVouchersService.getVouchers($stateParams.projectId),
      errorHandler: err => this.CucCloudMessage.error({
        text: `${this.$translate.instant('cpb_vouchers_get_error')} ${err.data}`,
      }),
    });
  }

  $onInit() {
    this.vouchers.load();
  }

  openAddVoucher() {
    this.$uibModal.open({
      windowTopClass: 'cui-modal',
      template: addVoucherTemplate,
      controller: addVoucherController,
      controllerAs: '$ctrl',
      resolve: {
        serviceName: () => this.$stateParams.projectId,
      },
    }).result.then(() => this.$onInit());
  }

  openAddCredit() {
    this.$uibModal.open({
      windowTopClass: 'cui-modal',
      template: addCreditTemplate,
      controller: addCreditController,
      controllerAs: 'CloudProjectBillingVouchersAddcreditCtrl',
    }).result.then((amount) => {
      this.CucServiceHelper.loadOnNewPage(this.addCredit(amount), {
        successMessage: (data) => {
          this.CucCloudMessage.success({
            textHtml: this.$translate.instant('cpb_vouchers_add_credit_success', {
              url: data.orderUrl,
              amount,
            }),
          });
        },
      });
    });
  }

  addCredit(amount) {
    return this.OvhApiOrderCloudProjectCredit.v6().save({
      serviceName: this.$stateParams.projectId,
    }, {
      amount,
    }).$promise;
  }
}
