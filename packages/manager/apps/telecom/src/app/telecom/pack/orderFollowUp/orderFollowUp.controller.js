export default class OrderFollowUpCtrl {
  /* @ngInject */
  constructor(
    $stateParams,
    $translate,
    TucToast,
    TucToastError,
    OrderFollowUpService,
    ORDER_STATUS,
  ) {
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.TucToast = TucToast;
    this.TucToastError = TucToastError;
    this.OrderFollowUpService = OrderFollowUpService;
    this.ORDER_STATUS = ORDER_STATUS;
  }

  $onInit() {
    this.events = [];
    this.loading = true;
    this.allSuccess = false;
    this.packName = this.$stateParams.packName;

    if (!this.packName) {
      this.TucToast.error(
        this.$translate.instant('xdsl_order_follow_up_total_error'),
      );
      this.loading = false;
    }

    this.loadData();
  }

  loadData() {
    this.OrderFollowUpService.getOrderFollowUp(this.packName)
      .then((data) => {
        this.events = data.map((elt) => {
          this.allSuccess = data.every((item) => item.status === 'done');

          const comments = elt.comments
            ? elt.comments.map((thisComment) => thisComment).join('')
            : '';

          return {
            badgeClass: this.ORDER_STATUS[elt.status]?.class,
            badgeIconClass: this.ORDER_STATUS[elt.status]?.icon,
            name: elt.name,
            status: elt.status,
            when: elt.doneDate,
            contentHtml: comments,
            side: 'right',
          };
        });

        this.orderStatus = data[data.length - 1].status;
        this.loading = false;
      })
      .catch((err) => {
        this.events = [];
        this.loading = false;
        this.TucToastError(err);
      });
  }
}
