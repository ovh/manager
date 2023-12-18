import 'moment';
import {
  SERVICE_TYPE,
  COMMIT_IMPRESSION_TRACKING_DATA,
  RECOMMIT_IMPRESSION_TRACKING_DATA,
} from '../constants';

export default class OvhManagerNetAppDashboardIndexCtrl {
  /* @ngInject */
  constructor($http, $translate, Alerter) {
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.$http = $http;

    this.SERVICE_TYPE = SERVICE_TYPE;
    this.isEditingName = false;
    this.editNameValue = '';
  }

  $onInit() {
    this.commitImpressionData = this.shouldReengage()
      ? RECOMMIT_IMPRESSION_TRACKING_DATA
      : COMMIT_IMPRESSION_TRACKING_DATA;
  }

  shouldReengage() {
    return (
      this.serviceInfos.engagedUpTo &&
      moment(this.serviceInfos.engagedUpTo).diff(moment(), 'month') < 3
    );
  }

  toggleNameEdition() {
    this.isEditingName = !this.isEditingName;
  }

  editName() {
    return this.$http
      .put(`/storage/netapp/${this.storage.id}`, {
        name: this.editNameValue,
      })
      .then((data) => {
        console.log(data);
        this.storage.update(data.data);
      })
      .finally(() => {
        this.isEditingName = false;
      });
  }

  onBillingInformationError(error) {
    this.Alerter.error(error);
  }
}
