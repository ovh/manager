import isEmpty from 'lodash/isEmpty';
import last from 'lodash/last';

export default /* @ngInject */ function OrderFollowUpCtrl(
  $stateParams,
  $translate,
  $http,
  TucToast,
  TucToastError,
  ORDER_STATUS,
) {
  this.events = [];
  this.loading = true;
  this.allSuccess = false;

  this.getByPackName = function getByPackName(packName) {
    const url = `/pack/xdsl/${packName}/orderFollowUp`;

    return $http
      .get(url)
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        throw new TucToastError(err);
      });
  };

  this.loadData = () => {
    this.getByPackName(this.packName)
      .then((data) => {
        this.events = data.map((elt) => {
          this.allSuccess = data.every((item) => item.status === 'done');

          const comments = elt.comments
            ? elt.comments
                .map((thisComment) => `<span>${thisComment}</span>`)
                .join('')
            : '';

          return {
            badgeClass: ORDER_STATUS[elt.status]?.class,
            badgeIconClass: ORDER_STATUS[elt.status]?.icon,
            name: elt.name,
            status: elt.status,
            when: elt.doneDate,
            contentHtml: comments,
            side: 'right',
          };
        });

        this.orderStatus = last(data)?.status;
        this.loading = false;
      })
      .catch((err) => {
        this.events = [];
        this.loading = false;
        TucToastError(err);
      });
  };

  this.$onInit = () => {
    this.events = [];
    this.loading = true;
    this.allSuccess = false;
    this.packName = $stateParams.packName;

    if (isEmpty(this.packName)) {
      console.warn('packName is empty');
      TucToast.error($translate.instant('xdsl_order_follow_up_total_error'));
      this.loading = false;
    }

    this.loadData();
  };
}
