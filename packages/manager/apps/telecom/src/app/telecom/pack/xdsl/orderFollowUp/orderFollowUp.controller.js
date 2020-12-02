import isEmpty from 'lodash/isEmpty';
import last from 'lodash/last';

export default /* @ngInject */ function XdslOrderFollowUpCtrl(
  $scope,
  $stateParams,
  OvhApiXdsl,
  $q,
  $translate,
  TucToast,
  TucToastError,
  ORDER_STATUS,
) {
  const self = this;

  this.loadData = function loadData() {
    $q.all([
      // Get access Details
      OvhApiXdsl.v6().get(
        {
          xdslId: self.xdslId,
        },
        (access) => {
          self.access = access;
        },
      ).$promise,

      // Get orders
      OvhApiXdsl.v6().getOrder(
        { xdslId: self.xdslId },
        (data) => {
          let allSuccessTmp = true;
          data.forEach((elt) => {
            if (elt.status !== 'done') {
              allSuccessTmp = false;
            }
            const comments = elt.comments
              .map((thisComment) => `<span>${thisComment}</span>`)
              .join('');
            self.events.push({
              badgeClass: ORDER_STATUS[elt.status].class,
              badgeIconClass: ORDER_STATUS[elt.status].icon,
              name: elt.name,
              status: elt.status,
              when: elt.doneDate,
              contentHtml: comments,
              side: 'right',
            });
          });
          self.orderStatus = last(data).status;
          self.allSuccess = allSuccessTmp;
        },
        (err) => {
          self.events = [];
          return new TucToastError(err);
        },
      ).$promise,
    ]).then(() => {
      self.loading = false;
    }, TucToastError);
  };

  this.init = function init() {
    self.events = [];
    self.loading = true;
    self.allSuccess = false;
    self.xdslId = $stateParams.serviceName;

    if (isEmpty(self.xdslId)) {
      return TucToast.error(
        $translate.instant('xdsl_order_follow_up_total_error'),
      );
    }

    return self.loadData();
  };

  this.init();
}
