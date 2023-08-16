import { DASHBOARD_TITLE } from './constants';

export default class VrackServicesCtrl {
  /* @ngInject */
  constructor($translate, coreConfig) {
    this.user = coreConfig.getUser();
    this.$translate = $translate;
    this.title = DASHBOARD_TITLE;
    this.informations = { loading: true };
  }

  $onInit() {
    this.informations.data = this.resource;

    this.informations.data.statusCode = VrackServicesCtrl.initializeStatusCode(
      this.informations.data.currentState.productStatus,
    );
    this.informations.data.creationDateFormatted =
      this.informations.data.createdAt &&
      this.formatDate(this.informations.data.createdAt);
    [this.informations.data.zoneCode] = this.resource.currentState.zone.split(
      '-',
    );

    this.informations.loading = false;
  }

  static initializeStatusCode(status) {
    switch (status) {
      case 'ACTIVE':
        return 'success';
      case 'DISABLED':
        return 'error';
      case 'DRAFT':
        return 'warning';
      default:
        return 'info';
    }
  }

  formatDate(date) {
    const language = this.user.language.replace('_', '-');
    const formatter = Intl.DateTimeFormat(language, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    return formatter.format(new Date(date));
  }
}
